class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 403;
  }
}

class InvalidParamsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidParamsError';
    this.statusCode = 400;
  }
}

class DuplicateEntryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateEntryError';
    this.statusCode = 400;
  }
}

export {
  NotFoundError,
  UnauthorizedError,
  InvalidParamsError,
  DuplicateEntryError,
};
