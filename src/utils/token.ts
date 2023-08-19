import { SignJWT, jwtVerify, JWTPayload } from 'jose'

export async function createToken (id: string, name: string, expiry = '30m') {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'UNSAFE_SECRET_PLEASE_SET')
  const token = await new SignJWT({ sub: id, name })
    .setProtectedHeader({ alg: 'HS512', typ: 'JWT' })
    .setExpirationTime(expiry)
    .setIssuedAt()
    .setIssuer(process.env.AUTH_ISSUER ?? 'example.com')
    .sign(secret)

  return token
}

export interface TokenPayload extends JWTPayload {
  name: string
}

export async function validateToken (token: string): Promise<TokenPayload> {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'UNSAFE_SECRET_PLEASE_SET')
  const result = await jwtVerify(token, secret, { currentDate: new Date(), algorithms: ['HS512'], issuer: process.env.AUTH_ISSUER ?? 'example.com' })

  return result.payload as TokenPayload
}
