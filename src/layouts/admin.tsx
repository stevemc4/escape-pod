import React, { FC, PropsWithChildren } from 'react'
import Link from 'next/link'
import { Home24Filled, Bed24Filled } from '@fluentui/react-icons'

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="grid grid-cols-[72px_minmax(0,_1fr)] h-screen">
      <div className="w-full border-r-2 border-r-gray-300 p-1 flex flex-col gap-2 items-center">
        <div className="p-2">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 19.6C8 19.0399 8 18.7599 8.10899 18.546C8.20487 18.3578 8.35785 18.2049 8.54601 18.109C8.75992 18 9.03995 18 9.6 18H13.5L29.0782 18C29.081 18 29.0838 18.0011 29.0858 18.0032V18.0032V18.0032C29.0877 18.0052 29.0904 18.0064 29.0932 18.0065C32.7615 18.1301 35.9863 20.0031 37.9598 22.8176C38.1852 23.1391 38.3942 23.4728 38.5858 23.8176C39.4868 25.4397 40 27.307 40 29.2941C40 29.684 39.684 30 39.2941 30H9.6C9.03995 30 8.75992 30 8.54601 29.891C8.35785 29.7951 8.20487 29.6422 8.10899 29.454C8 29.2401 8 28.9601 8 28.4V19.6ZM36.2417 23.8176C36.7466 23.8176 37.0258 23.2189 36.708 22.8176C34.8874 20.5711 32.1415 19.1078 29.0527 19.0057L28.8796 19L17.173 19C16.3046 19 15.8704 19 15.5904 19.2612C15.3757 19.4614 15.2385 19.8604 15.2832 20.154C15.3416 20.5369 15.6329 20.7763 16.2155 21.2549C18.072 22.78 20.4235 23.7246 22.9926 23.8111C22.9954 23.8112 22.9981 23.8124 23 23.8145V23.8145V23.8145C23.002 23.8165 23.0047 23.8176 23.0076 23.8176L36.2417 23.8176Z" fill="#141E46"/>
          </svg>
        </div>
        <Link href="/admin" className="p-2 hover:bg-blue-200 rounded text-gray-800">
          <Home24Filled />
        </Link>
        <Link href="/admin/rooms" className="p-2 hover:bg-blue-200 rounded text-gray-800">
          <Bed24Filled />
        </Link>
      </div>
      <div className="overflow-y-auto p-4">
        { children }
      </div>
    </main>
  )
}

export default AdminLayout
