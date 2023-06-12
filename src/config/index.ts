import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE, DB_PASS, DB_USR_NAME, REDIS_AUTH_PASS, REDIS_HOST, REDIS_PORT } = process.env;
export const ioRedisConnStr = `redis://:${REDIS_AUTH_PASS}@${REDIS_HOST}:${REDIS_PORT}`
