import { ErrorCode } from '@/app-error.js';
import type { Request, Response } from 'express'


export const notFoundMiddleware = (
  _req: Request,
  res: Response,
) => {

  res.status(404).json({
    success: false,
    error: {
      code: ErrorCode.RESOURCE_NOT_FOUND,
      message: "The requested route was not found",
    },
  });
}
