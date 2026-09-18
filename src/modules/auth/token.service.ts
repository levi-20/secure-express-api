import { JWTPayload, jwtVerify, SignJWT } from 'jose'
import { randomBytes, randomUUIDv7 } from 'node:crypto';

import config from '@/config.js'
import { revokeAndRotateRefreshToken, revokeFamily, saveRefreshToken } from './token.repository.js';
import { getHash } from './session.service.js';
import { AppError, ErrorCode } from '@/app-error.js';
import { RefreshAuth, JWTResponse } from '@/types.js';


const signJwt = async (userId: string) => {

  const secret = new Uint8Array(
    Buffer.from(config.auth.jwtSecret, "hex")
  );
  const expiresAt = Date.now() + config.auth.jwtTTL * 1_000;

  const accessToken = await new SignJWT({ sub: userId })
    .setIssuedAt()
    .setExpirationTime(`${config.auth.jwtTTL}s`)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)

  return {
    accessToken,
    expiresAt
  }
}

export const signAccessToken = async (userId: string) => {

  const refreshToken = await createRefreshToken(userId);
  const jwt = await signJwt(userId)

  return {
    ...jwt,
    refreshToken,
  }
}

export const createRefreshToken = async (userId: string): Promise<string> => {

  const familyId = randomUUIDv7();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + config.auth.refreshTTL);

  await saveRefreshToken({
    userId: userId,
    familyId: familyId,
    expiresAt: expiresAt,
    tokenHash: getHash(token),
  })

  return token
}

export const verifyAccessToken = async (token: string): Promise<JWTPayload> => {

  const secret = new Uint8Array(
    Buffer.from(config.auth.jwtSecret, "hex")
  );

  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  return payload;

}

export const signJwtWithRefreshToken = async (refreshAuth: RefreshAuth): Promise<JWTResponse> => {

  const jwt = await signJwt(refreshAuth.userId)
  const newRefreshToken = await rotateRefreshToken(refreshAuth)

  return {
    ...jwt,
    refreshToken: newRefreshToken
  }
}

export const rotateRefreshToken = async (refreshAuth: RefreshAuth): Promise<string> => {

  const newRefreshToken = randomBytes(32).toString("base64url")
  const expiresAt = Date.now() + config.auth.refreshTTL

  try {

    await revokeAndRotateRefreshToken(refreshAuth.tokenHash, {
      userId: refreshAuth.userId,
      expiresAt: new Date(expiresAt),
      familyId: refreshAuth.familyId,
      tokenHash: getHash(newRefreshToken)
    })

    return newRefreshToken

  } catch (err) {

    if (err instanceof Error && err.message === "REFRESH_TOKEN_ALREADY_USED") {

      await revokeFamily(refreshAuth.familyId);

      throw new AppError(401, ErrorCode.UNAUTHENTICATED, "Invalid refresh token");
    }
    throw err;
  }
}
