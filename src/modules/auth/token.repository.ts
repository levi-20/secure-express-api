import { and, eq, isNull, lte } from "drizzle-orm"

import { db } from "@/db/client.js"
import { RefreshToken } from "@/db/refresh-tokens.js"


type SaveRefreshTokenInput = Pick<typeof RefreshToken.$inferInsert, "userId" | "tokenHash" | "familyId" | "expiresAt">

export const saveRefreshToken = async (input: SaveRefreshTokenInput) => {

  await db.insert(RefreshToken).values(input)

}

export const getRefreshTokenbyHash = async (tokenHash: string) => {

  const [token] = await db.select({
    userId: RefreshToken.userId,
    familyId: RefreshToken.familyId,
    tokenHash: RefreshToken.tokenHash,
    expiresAt: RefreshToken.expiresAt,
    revokedAt: RefreshToken.revokedAt
  })
    .from(RefreshToken)
    .where(eq(RefreshToken.tokenHash, tokenHash))
    .limit(1)

  return token
}

export const revokeAndRotateRefreshToken = async (tokenHashToRevoke: string, newRefreshtokenInput: SaveRefreshTokenInput) => {

  await db.transaction(async (tx) => {

    const [revoked] = await tx.update(RefreshToken)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(RefreshToken.tokenHash, tokenHashToRevoke),
          isNull(RefreshToken.revokedAt)
        )
      )
      .returning({ id: RefreshToken.id });

    if (!revoked) {
      throw new Error("REFRESH_TOKEN_ALREADY_USED");
    }

    await tx.insert(RefreshToken).values(newRefreshtokenInput)
  })
}

export const revokeFamily = async (familyId: string) => {

  await db.update(RefreshToken)
    .set({ revokedAt: new Date() })
    .where(eq(RefreshToken.familyId, familyId))
}

export const cleanExpiredTokens = async () => {

  const result = await db.delete(RefreshToken)
    .where(
      lte(RefreshToken.expiresAt, new Date())
    );

  return result.rowCount
}