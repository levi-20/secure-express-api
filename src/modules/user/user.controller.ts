

import type { NextFunction, Request, Response } from "express";
import { autheticateUser, registerUser } from "./user.service.js";


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

  const { email, password } = req.body

  try {

    const user = await autheticateUser({ email, password })

    res.status(200).json({
      email: user.email,
      message: "Login successful"
    })

  } catch (err) {
    next(err)
  }
}