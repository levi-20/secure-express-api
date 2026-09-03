import { and, eq, gt, isNotNull, isNull } from "drizzle-orm";

import { db } from '@/db/client.js'
import { AuthSession } from '@/db/auth-sessions.js'


type CreateSessionInput = Pick<typeof AuthSession.$inferInsert, "userId" | "tokenHash" | "expiresAt">

export const createSession = async (input: CreateSessionInput) => {

  const [session] = await db.insert(AuthSession)
    .values(input)
    .returning({ id: AuthSession.id });

  return session
}

export const getActiveSessionByTokenHash = async (tokenHash: string) => {

  const [session] = await db.select()
    .from(AuthSession)
    .where(
      and(
        eq(AuthSession.tokenHash, tokenHash),
        isNull(AuthSession.revokedAt),
        gt(AuthSession.expiresAt, new Date())
      ),
    )
    .limit(1);

  return session
}

export const revokeSessionById = async (sessionId: string) => {

  const [session] = await db.update(AuthSession)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(AuthSession.id, sessionId),
        isNotNull(AuthSession.revokedAt)
      )
    ).returning({ id: AuthSession.id })

  return session;
}
