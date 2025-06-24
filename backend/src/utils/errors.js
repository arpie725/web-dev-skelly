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
    this.name = 'UnauthorziedError';
    this.statusCode = 403;
  }
}

class InternalError extends Error {
  constructor() {
    super('Internal Server Error');
    this.name = 'InternalError';
    this.statusCode = 503;
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

/** handles expected / unexpected errors
 * - determines whether the error is known or not
 * @params er (error), res (response)
 * @returns response
 */
async function handleErrors(er, res) {
  // expected error
  if (
    er instanceof NotFoundError ||
    er instanceof UnauthorizedError ||
    er instanceof InvalidParamsError ||
    er instanceof DuplicateEntryError ||
    er instanceof InternalError
  ) {
    return res.status(er.statusCode).json({
      success: false,
      errorType: er.name,
      message: er.message,
    });
  }
  // unexpected error
  console.log(er);
  return res.status(500).json({
    success: false,
    errorType: 'InternalServerError',
    message: 'Unexpected internal server error',
  });
}

export {
  NotFoundError,
  UnauthorizedError,
  InternalError,
  InvalidParamsError,
  DuplicateEntryError,
  handleErrors,
};
