

import type { NextFunction, Request, Response } from "express";
import { registerUser } from "./user.service.js";


export const getUserController = (_req: Request, res: Response) => {

  res.status(200)
    .json({
      status: "ok",
      message: "Looking awesome"
    });
}


export const createUserController = async (req: Request, res: Response, next: NextFunction) => {

  console.log("controller")
  const { email, password } = req.body;

  try {
    const user = await registerUser({ email, password })

    res.status(201).
      json({
        id: user?.id,
        email: user?.email,
      });
  }
  catch (err) {
    next(err)
  }


}