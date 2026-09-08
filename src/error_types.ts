export class BadRequestError extends Error {
    errorCode = 400;

    constructor(message: string) {
    super(message);
    }
}

export class UnauthorizedError extends Error {
    errorCode = 401;

  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
    errorCode = 403;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
    errorCode = 404;

  constructor(message: string) {
    super(message);
  }
}