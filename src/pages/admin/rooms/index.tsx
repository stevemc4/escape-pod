import React, { FC } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

import Layout from '../../../layouts/admin'
import fetcher from '../../../utils/fetcher'
import { ResponseShape } from '../../../utils/response'
import { RoomWithRoomType } from '../../../db/schemas/room'

const RoomsIndex: FC = () => {
  const { data } = useSWR<ResponseShape<RoomWithRoomType[]>>('/api/rooms', fetcher)

  return (
    <Layout>
      <h1 className="mt-1 text-2xl font-bold">Rooms</h1>
      <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        { data?.payload?.map(room => (
          <li key={room.id}>
            <Link href={`/admin/rooms/${room.id}`} className="p-4 rounded bg-gray-200 min-h-[96px] flex flex-col">
              <span className="text-xl mt-auto">{room.roomNumber}</span>
              <span className="text-base font-bold capitalize">{room.status}</span>
            </Link>
          </li>
        )) }
      </ul>
    </Layout>
  )
}

export default RoomsIndex
