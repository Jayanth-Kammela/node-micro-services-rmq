// Status codes
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class BaseError extends Error {
  constructor(name, statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.isOperational = isOperational;

    // Assign the stack trace if not provided
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
  }
}

// Specific error classes
class APIError extends BaseError {
  constructor(message) {
    super('API Error', STATUS_CODES.INTERNAL_ERROR, message);
  }
}

class ValidationError extends BaseError {
  constructor(message) {
    super('Validation Error', STATUS_CODES.BAD_REQUEST, message);
  }
}

class AuthorizationError extends BaseError {
  constructor(message) {
    super('Authorization Error', STATUS_CODES.UN_AUTHORIZED, message);
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super('Not Found Error', STATUS_CODES.NOT_FOUND, message);
  }
}


export { BaseError, APIError, ValidationError, NotFoundError, AuthorizationError, STATUS_CODES };
