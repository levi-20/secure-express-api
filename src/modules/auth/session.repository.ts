import { db } from '@/db/client.js'
import { AuthSession } from '@/db/auth-sessions.js'
import { and, eq, isNotNull } from 'drizzle-orm';


type CreateSessionInput = Pick<typeof AuthSession.$inferInsert, "userId" | "tokenHash" | "expiresAt">

export const createSession = async (input: CreateSessionInput) => {
  const [sessions] = await db.insert(AuthSession)
    .values(input)
    .returning();

  return sessions
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