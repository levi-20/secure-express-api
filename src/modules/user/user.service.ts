import { RegisterUserInput } from "@/types.js";
import { createUser, getUserByEmail } from "./user.repository.js";
import * as argon2 from "argon2";


export const registerUser = async ({ email, password }: RegisterUserInput) => {

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("A user with given email already exists.")
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id })


  return createUser({ email, passwordHash });

}