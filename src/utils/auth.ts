import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

import { db } from 'db/client'
import { accounts } from 'db/schemas'

import { validateToken } from './token'

export async function getAuth (request: NextRequest) {
  const token = request.cookies.get('token')
  if (token === undefined || token.value === '') {
    return { user: null, payload: null }
  }

  try {
    const payload = await validateToken(token.value)
    const user = await db.query.accounts
      .findFirst({
        where: eq(accounts.id, payload.sub ?? ''),
        columns: { password: false },
        with: {
          profile: true
        }
      })

    return { user, payload }
  } catch (e) {
    return { user: null, payload: null }
  }
}
