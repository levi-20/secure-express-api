import type { NextFunction, Request, Response } from "express";

import { autheticateUser, registerUser } from "./user.service.js";
import { createCsrfToken, createUserSession, logoutSession } from "@/auth/session.service.js";
import config from "@/config.js";
import { AppError, ErrorCode } from "@/app-error.js";
import { getUserById } from "./user.repository.js";
import { signAccessToken } from "@/auth/token.service.js";


export const getUserController = (_req: Request, res: Response, next: NextFunction) => {

  try {

    res.status(200).json({
      status: "ok",
      message: "Looking awesome"
    });

  } catch (err: unknown) {
    next(err)
  }

}

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {

  const { email, password } = req.body;

  try {
    const user = await registerUser({ email, password })

    res.status(201).json({
      id: user?.id,
      email: user?.email,
    });
  }
  catch (err) {
    next(err)
  }
}

export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { email, password } = req.body
    const user = await autheticateUser({ email, password })
    const { sessionId, token, expiresAt } = await createUserSession(user.id);

    res.cookie("sid", token, {
      httpOnly: true,
      secure: config.environment === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt
    });

    const csrfToken = createCsrfToken(sessionId)

    res.cookie("csrf", csrfToken, {
      httpOnly: false,
      secure: config.environment === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt
    });

    res.status(200).json({
      email: user.email,
      message: "Login successful"
    });

  } catch (err) {
    return next(err)
  }
}

export const getCurrentUserConntroller = async (req: Request, res: Response, next: NextFunction) => {

  try {
    if (!req.auth) return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."));

    const user = await getUserById(req.auth.userId);
    if (!user) return next(new AppError(404, ErrorCode.NOT_FOUND, "User not found."));

    return res.status(200).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });

  } catch (err) {
    return next(err)
  }
}

export const getCsrfTokenController = async (req: Request, res: Response, next: NextFunction) => {

  try {

    if (req.auth!.expiresAt <= new Date()) {
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Session expired"))
    }

    if (!req.auth?.sessionId)
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid or missing authentication credentials."))

    const csrfToken = createCsrfToken(req.auth!.sessionId);

    res.cookie("csrf", csrfToken, {
      httpOnly: false,
      secure: config.environment === "production",
      sameSite: "lax",
      path: "/",
      expires: req.auth!.expiresAt
    });

    res.setHeader("Cache-Control", "no-store")
    res.sendStatus(204)

  } catch (err) {
    return next(err)
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    if (!req.auth || !req.auth.sessionId)
      return next(new AppError(401, ErrorCode.UNAUTHENTICATED, "Authentication required."))
    
    await logoutSession(req.auth!.sessionId)

    res.clearCookie("sid", {
      httpOnly: true,
      secure: config.environment === 'production',
      sameSite: "lax",
      path: "/"
    });

    res.clearCookie("csrf", {
      httpOnly: false,
      secure: config.environment === 'production',
      sameSite: "lax",
      path: "/"
    });

    res.sendStatus(204);

  } catch (err) {
    return next(err)
  }
}

export const getAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { email, password } = req.body;
    const user = await autheticateUser({ email, password })

    const token = await signAccessToken(user.id)
    console.log("token", token)

    res.status(200).json(token)

  } catch (err) {
    next(err)
  }
}