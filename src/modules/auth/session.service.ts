import { Buffer } from 'node:buffer'
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"

import config from "@/config.js";
import { AppError, ErrorCode } from '@/app-error.js';
import { createSession, getActiveSessionByTokenHash, revokeSessionById } from "./session.repository.js";


export const getHash = (token: string) => {

  return createHash("sha256").update(token).digest("hex");
}

export const createUserSession = async (userId: string) => {

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + config.auth.sessionTTL);
  const session = await createSession({ userId, tokenHash: getHash(token), expiresAt })

  if (!session) throw new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Unable to create session")

  return { sessionId: session.id, token, expiresAt }
}

export const createCsrfToken = (sessionId: string) => {

  const random = randomBytes(32).toString("base64url");
  const signature = createHmac("sha256", config.auth.csrf).update(`${sessionId}.${random}`).digest("base64url");

  return `${signature}.${random}`;
}

export const findActiveSessionByToken = async (token: string) => {

  return await getActiveSessionByTokenHash(getHash(token))
}

export const verifyCsrfToken = (sessionId: string, csrfToken: string): boolean => {

  const [signature, random] = csrfToken.split(".");
  if (signature === undefined || random === undefined) return false

  const expectedSignature = createHmac("sha256", config.auth.csrf).update(`${sessionId}.${random}`).digest("base64url");
  const expected = Buffer.from(expectedSignature)
  const orignal = Buffer.from(signature)

  return signature?.length === expectedSignature.length && timingSafeEqual(expected, orignal)
}

export const logoutSession = async (sessionId: string) => {

  await revokeSessionById(sessionId)
}
