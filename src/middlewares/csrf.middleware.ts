import { RequestHandler } from "express";

import { AppError, ErrorCode } from "@/app-error.js";
import { verifyCsrfToken } from "@/auth/session.service.js";


export const verifyCsrf: RequestHandler = (req, _res, next) => {

  try {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next()

    const csrfCookie = req.cookies.csrf;
    const csrfHeader = req.get("X-CSRF-Token")

    if (!req.auth || !req.auth.sessionId) {
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."))
    }

    if ((!csrfCookie || !csrfHeader)
      || csrfCookie !== csrfHeader
      || !verifyCsrfToken(req.auth.sessionId, csrfHeader)
    ) {
      return next(new AppError(403, ErrorCode.CSRF_INVALID, "Invalid CSRF."))
    }

    return next();

  } catch (err) {
    return next(err)
  }
}
