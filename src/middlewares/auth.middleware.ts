import { AppError } from "@/app-error.js";
import { findActiveSessionByToken } from "@/auth/session.service.js";
import { RequestHandler } from "express";



export const authenticate: RequestHandler = async (req, _res, next) => {

  try {

    const token = req.cookies.sid;

    console.log(req.cookies)
    if (typeof token !== "string") return next(new AppError(401, "UNAUTHENTICATED", "Authentication required."))

    const session = await findActiveSessionByToken(token);
    if (!session) return next(new AppError(401, "UNAUTHENTICATED", "Authentication required."))

    req.auth = {
      userId: session.userId,
      sessionId: session.id
    }
    console.log("authentication successful")
    return next();

  } catch (err) {
    return next(err)
  }

}