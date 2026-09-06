
import config from '@/config.js'
import { jwtVerify, SignJWT } from 'jose'

export const signAccessToken = async (userId: string) => {

  const secret = new Uint8Array(
    Buffer.from(config.auth.jwtSecret, "hex")
  );

  const now = Date.now()
  const exp = now / 1_000 + config.auth.jwtTTL

  const jwt = await new SignJWT({ sub: userId })
    .setIssuedAt()
    .setExpirationTime(exp + 's')
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)

  console.log("jwt", jwt)
  return {
    token: jwt,
    expiresAt: exp * 1_000
  }
}

export const verifyAccessToken = async (token: string) => {

  const secret = new Uint8Array(
    Buffer.from(config.auth.jwtSecret, "hex")
  );

  const { payload } = await jwtVerify(token, secret);
  return payload;

}