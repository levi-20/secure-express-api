import { Request, Response, NextFunction } from 'express'



export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const requestId = req.headers['x-request-id']  || crypto.randomUUID();

  res.setHeader('X-Request-Id', requestId);

  next();
}