import express from 'express';
import config from './config/index.js';
import { databaseConnection } from './database/index.js';
import setupExpressApp from './express-app.js';
import { CreateChannel } from './utils/index.js';
import logger from './utils/logger.js';

let server;

const startServer = async () => {
  const app = express();

  try {
    await databaseConnection();

    const channel = await CreateChannel();

    // Set up express routes and middlewares
    await setupExpressApp(app, channel);

    server = app.listen(config.PORT, () => {
      logger.info(`Server listening on port ${config.PORT}`);
    });

    server.on('error', (err) => {
      logger.error('Server error: ' + err.message);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Error during server startup: ' + error.message);
    process.exit(1);
  }
};

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
};

// Handle uncaught exceptions and unhandled promise rejections
const unexpectedErrorHandler = (error) => {
  logger.error('Unexpected error: ' + error.message);
  exitHandler();
};

// Set process-level event handlers
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler(); // Gracefully shut down on termination signal
});

// Start the server
await startServer();
