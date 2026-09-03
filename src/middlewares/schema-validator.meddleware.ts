import type { RequestHandler } from 'express'
import type { ValidateFunction } from 'ajv';

import { AppError, ErrorCode } from '@/app-error.js';

export const validateRequestBody = (validate: ValidateFunction): RequestHandler => {

  return (req, _res, next) => {

    if (!validate(req.body)) {
      // if fails redirect request to error middleware
      return next(new AppError(400, ErrorCode.INVALID_REQUEST, "Request body validation failed.", validate.errors))
    }

    // calls the next funtion (middleware / controller ) in the chain
    return next();
  }
}
