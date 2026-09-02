import type { RequestHandler } from 'express'
import type { ValidateFunction } from 'ajv';

import { AppError } from '@/app-error.js';

export const validateRequestBody = (validate: ValidateFunction): RequestHandler => {

  return (req, _res, next) => {

    // if fails redirect request to error middleware
    if (!validate(req.body)) {
      return next(
        new AppError(
          400,
          "INVALID_REQUEST",
          "Request body validation failed",
          validate.errors
        )
      )
    }

    // calls the next funtion (middleware / controller ) in the chain
    return next();
  }

}