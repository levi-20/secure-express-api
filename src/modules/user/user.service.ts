import * as argon2 from "argon2";

import { AppError } from "@/app-error.js";
import { createUser, getUserByEmail } from "./user.repository.js";
import { LoginUserInput, RegisterUserInput } from "@/types.js";


export const registerUser = async ({ email, password }: RegisterUserInput) => {

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new AppError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "A user with given email already exists."
    )
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id })

  const user = await createUser({ email, passwordHash });

  if (!user) {
    throw new AppError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "A user with given email already exists.",
    );
  }

  return user

}

export const autheticateUser = async ({ email, password }: LoginUserInput) => {

  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invaid email or password"
    )
  }

  if (!await argon2.verify(user.passwordHash, password)) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invaid email or password"
    )
  }

  return user

}