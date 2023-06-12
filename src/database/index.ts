import { DB_HOST, DB_PORT, DB_DATABASE, DB_USR_NAME, DB_PASS } from '@config';
import { ConnectOptions } from 'mongoose';

// export const dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export const dbConnection = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: DB_USR_NAME,
      pass: DB_PASS,
    } as ConnectOptions,
  };