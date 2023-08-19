import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { NextApiRequest, NextApiResponse } from 'next'
import { objectAsync, stringAsync, ValiError, string, minLength } from 'valibot'

import { db } from '../../../db/client'
import { accounts, NewAccount } from '../../../db/schemas/accounts'
import { profiles, NewProfile } from '../../../db/schemas/profile'

import { error, success } from '../../../utils/response'
import createToken from '../../../utils/token'

const registerValidator = objectAsync({
  username: stringAsync([async (input, info) => {
    const existingUser = await db.query.accounts.findFirst({ where: eq(accounts.username, input) })
    if (existingUser) throw new ValiError([{ validation: 'database', origin: 'value', message: 'Duplicate user', input, ...info }])
    return input
  }]),
  password: string([minLength(8)]),
  name: string([minLength(1)])
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
    const parsed = await registerValidator.parse(req.body)
    if (!parsed) {
      res.status(400).json({ error: 'Bad request' })
    }

    const password = await bcrypt.hash(parsed.password, 10)

    const newAccount: NewAccount = {
      username: parsed.username,
      password,
      role: 'user'
    }

    const createdAccount = await db.insert(accounts).values(newAccount).returning()

    const newProfile: NewProfile = {
      name: parsed.name,
      account_id: createdAccount[0].id
    }

    const createdProfile = await db.insert(profiles).values(newProfile).returning()

    const token = createToken(createdAccount[0].id, createdProfile[0].name)

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
