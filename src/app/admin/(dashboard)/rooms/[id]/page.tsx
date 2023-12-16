import { eq } from 'drizzle-orm'
import { db } from 'db/client'
import { rooms } from 'db/schemas/room'
import { notFound } from 'next/navigation'

interface Params {
  id: string
}

const RoomDetail = async ({ params }: { params: Params }) => {
  const room = await db.query.rooms.findFirst({ with: { roomType: true }, where: eq(rooms.id, params.id) })

  if (!room) {
    notFound()
  }

  return (
    <main>
      <h1 className="mt-1 text-4xl font-semibold">{ room.roomNumber }</h1>
      <h2 className="mt-1 text-xl font-bold">{ room.roomType.name }</h2>
      <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">

      </ul>
    </main>
  )
}

export default RoomDetail
