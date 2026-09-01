import type { RequestHandler } from 'express'
import type { ValidateFunction } from 'ajv';

export const validateRequestBody = (validate: ValidateFunction): RequestHandler => {

  console.log("here")
  return (req, res, next) => {

    if (!validate(req.body)) {
      console.log("inside")
      res.status(400).json({ error: validate?.errors })
    } 
    console.error(validate.errors)
    next();
  }

}