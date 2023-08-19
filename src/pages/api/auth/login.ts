import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { NextApiRequest, NextApiResponse } from 'next'
import { objectAsync, stringAsync, ValiError, string, minLength } from 'valibot'

import { db } from '../../../db/client'
import { accounts } from '../../../db/schemas/accounts'

import { error, success } from '../../../utils/response'
import createToken from '../../../utils/token'

const loginValidator = objectAsync({
  username: stringAsync(),
  password: string([minLength(8)])
})

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).json({ error: 'Bad request' })
    return
  }

  try {
    const parsed = await loginValidator.parse(req.body)
    if (!parsed) {
      res.status(400).json({ error: 'Bad request' })
    }

    const account = await db.query.accounts.findFirst({ where: eq(accounts.username, parsed.username), with: { profile: true } })

    if (!account) {
      res.status(200).json(error(200, 'Invalid username or password'))
      return
    }

    const passwordMatch = await bcrypt.compare(parsed.password, account.password)

    if (!passwordMatch) {
      res.status(200).json(error(200, 'Invalid username or password'))
      return
    }

    const token = await createToken(account.id, account.profile.name)

    res.status(200).json(success({
      token
    }))
  } catch (e) {
    if (e instanceof ValiError) {
      res.status(400).json(error(400, e.message))
      return
    }

    res.status(500).json(error(500, 'Internal server error'))
  }
}
