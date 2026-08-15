import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { AppError } from '@/app-error.js'


export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {

  const requestId = res.get("X-Request-Id");

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      
      success: false,
      requestId,
      error: {
        code: err.code,
        message: err.message,
      },
    });

    return
  }

  console.error(err);

  res.status(500).json({

    success: false,
    requestId,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });

}