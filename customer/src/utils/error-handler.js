import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../utils/logger.js";
import { BaseError } from "../utils/app-errors.js";

// Error converter middleware
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof BaseError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error;
   logger.error("first",error.message)
    error = new BaseError("Error", statusCode, message, false, err.stack);
  }

  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // For production, hide non-operational error details
  if (config.ENV === "prod" && !err.isOperational) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.ENV === "dev" && { stack: err.stack }), // stack trace in development only
  };

  if (config.ENV === "dev") {
    logger.error(err); // Log the error in development
  }

  res.status(statusCode).send(response);
};

export { errorHandler, errorConverter };