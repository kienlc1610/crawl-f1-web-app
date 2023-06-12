import { REDIS_AUTH_PASS, REDIS_HOST, REDIS_PORT, ioRedisConnStr } from '@/config';
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

  constructor() {
    const queueName = 'Crawl-F1-Queue';
    this.connection = new IORedis(ioRedisConnStr);
    this.queue = new Queue(queueName, {
      connection: this.connection
    });

    this.worker = new Worker(queueName, async (job: Job) => this.crawl(), { connection: this.connection });
  }

  init() {
    // Repeat job once every day at 23:59
    this.queue.add('crawl', {

    }, {
      repeat: {
        pattern: '* 59 23 * * *',
      },
    });
  }

  async crawl() {
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

    console.log(await new ResultFilterConditionModel(obj).save());

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