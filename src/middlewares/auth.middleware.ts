import { RequestHandler } from "express";

import { AppError, ErrorCode } from "@/app-error.js";
import { findActiveSessionByToken } from "@/auth/session.service.js";


export const authenticate: RequestHandler = async (req, _res, next) => {

  try {
    const token = req.cookies.sid;

    if (!token || typeof token !== "string")
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."))

    const session = await findActiveSessionByToken(token);
    if (!session)
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."))

    req.auth = {
      sessionId: session.id,
      expiresAt: session.expiresAt,
      userId: session.userId,
    }

    return next();

  } catch (err) {
    return next(err)
  }
}
