import { Request, RequestHandler } from "express";

import { AppError, ErrorCode } from "@/app-error.js";
import { findActiveSessionByToken, getHash } from "@/auth/session.service.js";
import { verifyAccessToken } from "@/auth/token.service.js";
import { getRefreshTokenbyHash, revokeFamily } from "@/auth/token.repository.js";

const checkAuthrizationHeader = (req: Request): string => {

  const authrization = req.get("Authorization");
  if (!authrization)
    throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required.")

  const [scheme, token, extra] = authrization.split(" ");
  if (scheme !== "Bearer" || !token || extra)
    throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials.")

  return token
}

export const authenticateCookeiMiddleware: RequestHandler = async (req, _res, next) => {

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

export const authenticateJwtTokenMiddleware: RequestHandler = async (req, _res, next) => {

  const token = checkAuthrizationHeader(req)

  try {
    const payload = await verifyAccessToken(token);
    if (!payload.sub || !payload.exp)
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))

    req.auth = {
      userId: payload!.sub,
      expiresAt: new Date(payload.exp * 1_000)
    }

    return next()

  } catch (err) {
    console.error("Authnetication failed", err)
    return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))
  }
}

export const authenticateRefreshTokenMiddleware: RequestHandler = async (req, res, next) => {

  try {
    const refreshToken = checkAuthrizationHeader(req)

    const existing = await getRefreshTokenbyHash(getHash(refreshToken))

    if (!existing)
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid refresh token")

    if (existing.revokedAt) {

      console.warn("Refresh token compromised, revoke whole family")
      await revokeFamily(existing.familyId)

      throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid refresh token")
    }

    if (existing.expiresAt <= new Date())
      throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Refresh token expired")

    req.refreshAuth = {
      userId: existing.userId,
      familyId: existing.familyId,
      tokenHash: existing.tokenHash
    }

    return next()

  } catch (err) {
    return next(err)
  }
}
