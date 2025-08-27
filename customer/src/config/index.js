import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    ACCESS_EXPIRATION_MINUTES: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    REFRESH_EXPIRATION_DAYS: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  },
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  CUSTOMER_SERVICE: 'customer_service',
  SHOPPING_SERVICE: 'shopping_service',
  SENTRY_DSN: process.env.SENTRY_DSN,
};

export default config;
