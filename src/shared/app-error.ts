type HttpErrorStatusCode =
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

type ErrorCode =
  | "EMAIL_ALREADY_EXISTS"
  | "INTERNAL_SERVER_ERROR"
  | "INVALID_CREDENTIALS"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "UNAUTHENTICATED";

export class AppError extends Error {

  constructor(
    public readonly statusCode: HttpErrorStatusCode,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}