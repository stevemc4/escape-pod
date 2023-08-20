import { createInsertSchema } from 'drizzle-valibot'
import { NextApiRequest, NextApiResponse } from 'next'
import { undefinedType, ValiError } from 'valibot'

import { db } from '../../../../db/client'
import { roomTypes, NewRoomType } from '../../../../db/schemas/roomType'

import { error, success } from '../../../../utils/response'

const insertSchema = createInsertSchema(roomTypes, {
  id: undefinedType(),
  createdAt: undefinedType(),
  updatedAt: undefinedType()
})

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const roomTypes = await db.query.roomTypes.findMany()

      res.status(200).json(success(roomTypes))
      return
    }

    if (req.method === 'PUT') {
      if (req.headers['content-type'] !== 'application/json') {
        res.status(400).json({ error: 'Bad request' })
        return
      }

      const parsed = insertSchema.parse(req.body)

      const newRoomType: NewRoomType = {
        name: parsed.name,
        shortDescription: parsed.shortDescription,
        description: parsed.description,
        basePrice: parsed.basePrice,
        maxOccupant: parsed.maxOccupant
      }

      const createdRoomType = await db.insert(roomTypes).values(newRoomType).returning()

      res.status(201).json(success(createdRoomType[0], 201))
      return
    }

    res.status(405).json(error(405, 'Method not allowed'))
  } catch (e) {
    if (e instanceof ValiError) {
      res.status(400).json(error(400, e.message))
      return
    }

    res.status(500).json(error(500, 'Internal server error'))
  }
}
