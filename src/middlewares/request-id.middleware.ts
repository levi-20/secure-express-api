import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express'


export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const requestId = req.get('x-request-id') ?? randomUUID();
  
  res.setHeader('X-Request-Id', requestId);

  next();
}