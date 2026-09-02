import { and, eq, gt, isNull } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto"


import config from "@/config.js";
import { createSession, revokeSessionById } from "./session.repository.js";
import { db } from "@/db/client.js";
import { AuthSession } from "@/db/auth-sessions.js";


export const hashSessionToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const createUserSession = async (userId: string) => {

  const token = randomBytes(32).toString("base64url");

  const expiresAt = new Date(Date.now() + config.auth.sessionTTL);

  await createSession({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt
  })

  return { token, expiresAt }
}

export const findActiveSessionByToken = async (token: string) => {

  const [session] = await db.select()
    .from(AuthSession)
    .where(
      and(
        eq(AuthSession.tokenHash, hashSessionToken(token)),
        isNull(AuthSession.revokedAt),
        gt(AuthSession.expiresAt, new Date())
      ),
    )
    .limit(1);

  return session
}

export const logoutSession = async (sessionId: string) => {

  await revokeSessionById(sessionId)
}