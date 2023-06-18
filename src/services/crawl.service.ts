import { ioRedisConnStr } from '@/config';
import { RaceResult, RaceResultModel } from '@/models/race-result.model';
import { ResultFilterConditionModel } from '@/models/result-filter-condition.model';
import { logger } from '@/utils/logger';
import { Job, Queue, Worker } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import IORedis from 'ioredis';
import puppeteer, { ElementFor, ElementHandle } from 'puppeteer';

class CrawlService {
  private connection;
  private queue: Queue<any, any>;
  private worker: Worker;
  private redisCache: IORedis;

  constructor() {
    const queueName = 'Crawl-F1-Queue';
    this.redisCache = new IORedis(ioRedisConnStr, { maxRetriesPerRequest: null });
    this.connection = new IORedis(ioRedisConnStr, { maxRetriesPerRequest: null });
    this.queue = new Queue(queueName, {
      connection: this.connection,
    });

    this.worker = new Worker(queueName, async (job: Job) => this.crawl(), { connection: this.connection });
  }

  init() {
    // Repeat job once every day at 23:59
    this.queue.add('crawl', {}, {
      repeat: {
        pattern: '* 59 23 * * *',
      },
    });

    this.crawl();
  }

  async crawl() {
    const countDocs = await ResultFilterConditionModel.countDocuments();
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    logger.info('Do crawl Formula 1')
    await page.goto('https://www.formula1.com/en/results.html/races.html');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('.ResultArchiveContainer .resultsarchive-filter');
    const listYearsSelector = await page.$$('.ResultArchiveContainer .resultsarchive-filter .resultsarchive-filter-item > a[data-name="year"]');
    const listTypesSelector = await page.$$('.ResultArchiveContainer .resultsarchive-filter .resultsarchive-filter-item > a[data-name="apiType"]');
    const listMeetingSelector = await page.$$('.ResultArchiveContainer .resultsarchive-filter .resultsarchive-filter-item > a[data-name="meetingKey"]');

    const obj = {
      years: await this.collectData(listYearsSelector),
      types: await this.collectData(listTypesSelector),
      meetings: await this.collectData(listMeetingSelector),
    }

    await browser.close();
    if (countDocs === 0) {
      await new ResultFilterConditionModel(obj).save();
    }

    // Get 10 years
    for await (const year of (await ResultFilterConditionModel.findOne()).years.slice(0, 19)) {
      const existedYear = await this.redisCache.hget('crawledYears', String(year));
      if (!Boolean(existedYear)) {
        await this.crawlResultsByYear(year);
        await this.redisCache.hset('crawledYears', String(year), 'true');
      }
    }
  }

  private async crawlResultsByYear(year: number) {
    const url = `https://www.formula1.com/en/results.html/${year}/races.html`;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    logger.info('Do crawl Formula 1 By Year')
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('.ResultArchiveContainer .resultsarchive-table');
    const headersSelectors = await page.$$('.ResultArchiveContainer .resultsarchive-table thead tr:nth-child(1) th');
    const listDataSelectors = await page.$$('.ResultArchiveContainer .resultsarchive-table tbody tr');
    const headers = await Promise.all(headersSelectors.map(async it => await (await it.getProperty('textContent')).jsonValue()))
      .then(headers => headers.filter(it => !!it));

    for (const row of listDataSelectors) {
      const listData = await row.$$('td');
      const values = await Promise.all(listData.map(async it => {
        const jsonVal: string = await it.evaluate(ele => ele.innerText);
        return jsonVal.replace(RegExp('\n'), '').replace(RegExp('\s+'), ' ').trim();
      })).then(val => val.filter(it => !!it));
      const builtObj = headers.reduce((o, key, index) => ({ ...o, [key]: values[index] }), {});
      const model = plainToInstance(RaceResult, builtObj);
      await new RaceResultModel({
        ...model,
        year,
      }).save();
    }

    await browser.close();
  }

  private async collectData(selectors: ElementHandle<ElementFor<"a">>[]) {
    const list = [];
    for await (const val of selectors.map(item => item.evaluate((ele) => ele.getAttribute('data-value')))) {
      list.push(val);
    }

    return list;
  }
}

export default new CrawlService();