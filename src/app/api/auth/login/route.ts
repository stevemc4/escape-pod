import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { object, ValiError, string, minLength, parse } from 'valibot'

import { db } from 'db/client'
import { accounts } from 'db/schemas/accounts'

import { badRequest, error, success } from 'utils/response'
import { createToken } from 'utils/token'

const LoginValidator = object({
  username: string(),
  password: string([minLength(8)])
})

export async function POST (request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json') {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  try {
    const body = await request.json()

    const parsed = parse(LoginValidator, body)
    if (!parsed) {
      return badRequest()
    }

    const account = await db.query.accounts.findFirst({ where: eq(accounts.username, parsed.username), with: { profile: true } })

    if (!account) {
      return badRequest('Invalid username or password')
    }

    const referrer = request.headers.get('referer')
    if (referrer !== null) {
      const pathname = new URL(referrer).pathname
      if (pathname === '/admin/login' && account.role === 'user') {
        return badRequest('Invalid username or password')
      }
    }

    const passwordMatch = await bcrypt.compare(parsed.password, account.password)

    if (!passwordMatch) {
      return badRequest('Invalid username or password')
    }

    const token = await createToken(account.id, account.profile.name)
    const cookieStore = cookies()
    cookieStore.set('token', token)

    return Response.json(success({
      token
    }))
  } catch (e) {
    if (e instanceof ValiError) {
      return badRequest(e.message)
    }

    return Response.json(error(500, 'Internal Server Error'), { status: 500 })
  }
}
