import express from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport'
import { fileURLToPath } from 'url';
import { customer } from './api/index.js';
import { errorHandler } from './utils/error-handler.js';
import { NotFoundError, STATUS_CODES } from './utils/app-errors.js';
import jwtStrategy from './utils/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function setupExpressApp(app, channel) {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  // enable cors
  app.use(cors());
  app.options('*', cors());
  app.use(express.static(`${__dirname}/public`));

  // jwt authentication
  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy);

  // API routes
  customer(app, channel);

  // v1 api routes
  // app.use('/api/v1', routes);

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new NotFoundError(STATUS_CODES.NOT_FOUND, 'Not found'));
  });

  // Centralized error handling middleware
  app.use(errorHandler);
}
