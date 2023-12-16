import Link from 'next/link'
import { db } from '../../../../db/client'

const RoomsIndex = async () => {
  const rooms = await db.query.rooms.findMany({ with: { roomType: true } })

  return (
    <main>
      <h1 className="mt-1 text-2xl font-bold">Rooms</h1>
      <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        { rooms.map(room => (
          <li key={room.id}>
            <Link href={`/admin/rooms/${room.id}`} className="p-4 rounded bg-gray-200 min-h-[96px] flex flex-col">
              <span className="text-xl mt-auto">{room.roomNumber}</span>
              <span className="text-base font-bold capitalize">{room.status}</span>
            </Link>
          </li>
        )) }
      </ul>
    </main>
  )
}

export default RoomsIndex
