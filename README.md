# Demo Crawl F1 Web

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Config ENV local
```
cp .env.development.example .env.development.local
```

## Run Locally

Clone the project

```bash
  git clone git@github.com:kienlc1610/crawl-f1-web-app.git
```

Install dependencies

```bash
  npm install
```

```bash
  [Required Docker] Start MongoDB & Redis in Docker. SHOULD use ENV file.
  npm run docker:start
```

Start the server

```bash
  npm run dev
```


## Deployment

To deploy dev this project run

```bash
  npm run deploy:dev
```

To deploy production this project run

```bash
  npm run deploy:prod
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Tech Stack

**Server:** Node.js, Express.js, Typescript, Mongoose, Typegoose


