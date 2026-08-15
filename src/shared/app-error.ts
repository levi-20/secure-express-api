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
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "INVALID_REQUEST";

export class AppError extends Error{

  constructor(
    public readonly statusCode: HttpErrorStatusCode,
    public readonly code: ErrorCode,
    message: string
  ) { 
    super(message)
    this.name = "AppError"
  }
}