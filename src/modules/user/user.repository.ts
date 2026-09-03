import { eq } from "drizzle-orm";

import { db } from "@/db/client.js";
import { User } from "@/db/user.js";



export const getUserByEmail = async (email: string) => {

  const [user] = await db.select()
    .from(User)
    .where(eq(User.email, email))
    .limit(1)

  return user
}

export const getUserById = async (id: string) => {

  const [user] = await db.select()
    .from(User)
    .where(eq(User.id, id))
    .limit(1);

  return user;
}

export const createUser = async ({ email, passwordHash }: any) => {

  const [user] = await db.insert(User)
    .values({ email, passwordHash })
    .onConflictDoNothing({ target: User.email })
    .returning()

  return user
}
