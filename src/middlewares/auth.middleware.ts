import { RequestHandler } from "express";

import { AppError, ErrorCode } from "@/app-error.js";
import { findActiveSessionByToken } from "@/auth/session.service.js";
import { verifyAccessToken } from "@/auth/token.service.js";


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

export const authenticateToken: RequestHandler = async (req, _res, next) => {

  const authrization = req.get("Authorization");
  if (!authrization)
    return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."))

  const [scheme, token, extra] = authrization.split(" ");
  if (scheme !== "Bearer" || !token || extra)
    return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))

  try {
    const payload = await verifyAccessToken(token);
    if (!payload.sub || !payload.exp)
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))

    req.auth = {
      userId: payload!.sub,
      expiresAt: new Date(payload.exp * 1_000)
    }

    next()

  } catch (err) {
    console.error("Authnetication failed", err)
    return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))
  }
}

