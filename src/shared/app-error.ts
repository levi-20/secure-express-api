type HttpStatusCode =
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500
  | 502
  | 503;

export enum ErrorCode {
  CSRF_INVALID = 'CSRF_INVALID',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_REQUEST = 'INVALID_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export class AppError extends Error {

  constructor(
    public readonly statusCode: HttpStatusCode,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}
