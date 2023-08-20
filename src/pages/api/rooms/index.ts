import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-valibot'
import { NextApiRequest, NextApiResponse } from 'next'
import { undefinedType, ValiError, string, uuid } from 'valibot'

import { db } from '../../../db/client'
import { rooms, NewRoom } from '../../../db/schemas/room'
import { roomTypes } from '../../../db/schemas/roomType'

import { error, success } from '../../../utils/response'

const insertSchema = createInsertSchema(rooms, {
  id: undefinedType(),
  createdAt: undefinedType(),
  updatedAt: undefinedType(),
  roomTypeId: string([uuid()])
})

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const rooms = await db.query.rooms.findMany({ with: { roomType: true } })

      res.status(200).json(success(rooms))
      return
    }

    if (req.method === 'PUT') {
      if (req.headers['content-type'] !== 'application/json') {
        res.status(400).json({ error: 'Bad request' })
        return
      }

      const parsed = insertSchema.parse(req.body)

      const roomType = await db.query.roomTypes.findFirst({ where: eq(roomTypes.id, parsed.roomTypeId) })

      if (!roomType) {
        res.status(422).json(error(422, 'Unprocessable Entity: Invalid roomTypeId'))
        return
      }

      const newRoom: NewRoom = {
        roomNumber: parsed.roomNumber,
        roomTypeId: parsed.roomTypeId,
        status: parsed.status,
        statusAdditionalReason: parsed.statusAdditionalReason,
        price: parsed.price ?? roomType.basePrice
      }

      const createdRoom = await db.insert(rooms).values(newRoom).returning()

      res.status(201).json(success(createdRoom[0], 201))
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
