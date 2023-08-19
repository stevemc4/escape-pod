import { SignJWT, jwtVerify } from 'jose'

export async function createToken (id: string, name: string, expiry = '30m') {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'UNSAFE_SECRET_PLEASE_SET')
  const token = await new SignJWT({ sub: id, name })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(expiry)
    .setIssuedAt()
    .setIssuer('Example.com')
    .sign(secret)

  return token
}

export async function validateToken (token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'UNSAFE_SECRET_PLEASE_SET')
  await jwtVerify(token, secret, { currentDate: new Date(), algorithms: ['HS512'] })

  return true
}
