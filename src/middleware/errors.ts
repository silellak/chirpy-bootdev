import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../error_types.js";

export function middlewareHandleError(err: any, req: any, res: any, next: any) {
  console.error(err);

  res.status(err.errorCode || 500).json({ error: err.message || 'Internal Server Error' });
}