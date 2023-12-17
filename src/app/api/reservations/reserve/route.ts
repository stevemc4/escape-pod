import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { ValiError, array, coerce, date, maxLength, minLength, object, picklist, required, string, uuid, parse } from 'valibot'

import { db } from 'db/client'
import { reservations, rooms } from 'db/schemas'
import { NewReservation } from 'db/schemas/reservations'
import { getAuth } from 'utils/auth'
import { badRequest, error, success, unauthorized, unprocessable } from 'utils/response'
import { NewGuest, guests } from 'db/schemas/guests'

const InsertSchema = required(object({
  idNumber: string([minLength(1), maxLength(32)]),
  roomId: string([uuid()]),
  startDate: coerce(date(), (i) => new Date(i as number)),
  endDate: coerce(date(), (i) => new Date(i as number)),
  guests: array(object({
    name: string(),
    type: picklist(['adult', 'child'])
  }))
}))

export async function POST (request: NextRequest) {
  const { user } = await getAuth(request)
  if (!user) return unauthorized()

  if (request.headers.get('content-type') !== 'application/json') {
    return badRequest()
  }

  try {
    const parsed = parse(InsertSchema, await request.json())

    const room = await db.query.rooms.findFirst({ where: eq(rooms.id, parsed.roomId) })
    if (!room) {
      return unprocessable('Unprocessable Entity: invalid roomId')
    }

    const newReservation: NewReservation = {
      reserverAccountId: user.id,
      reserverName: user.profile.name,
      reserverId: parsed.idNumber,
      roomId: room.id,
      startDate: parsed.startDate,
      endDate: parsed.endDate
    }

    const reservation = await db.transaction(async (tx) => {
      const insertedReservation = (await tx.insert(reservations).values(newReservation).returning())[0]

      const newGuests: NewGuest[] = parsed.guests.map(guest => ({
        reservationId: insertedReservation.id,
        name: guest.name,
        type: guest.type
      }))

      const insertedGuests = await tx.insert(guests).values(newGuests).returning()

      return {
        ...insertedReservation,
        guests: insertedGuests
      }
    })

    return Response.json(success(reservation))
  } catch (e) {
    if (e instanceof ValiError) {
      console.log(e)
      return badRequest(e.message)
    }

    return Response.json(error(500, 'Internal server error'), { status: 500 })
  }
}
