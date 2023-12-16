import React, { FC, FormEvent } from 'react'
import useSWRMutation from 'swr/mutation'
import { mutator } from '../../utils/fetcher'
import { ResponseShape } from '../../utils/response'
import { useRouter } from 'next/router'

const Login: FC = () => {
  const { trigger, isMutating, error } = useSWRMutation('/api/auth/login', mutator)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response: ResponseShape<{ token: string }> = await trigger({
        auth: false,
        method: 'POST',
        payload: {
          username: formData.get('username'),
          password: formData.get('password')
        }
      })

      localStorage.setItem('token', response.payload?.token ?? '')
      router.push('/admin')
    } catch (e) {

    }
  }

  return (
    <div className="flex p-4 items-center justify-center min-h-screen bg-gray-200">
      <div className="shadow-sm rounded p-4 bg-white w-full max-w-sm">
        <h2 className="text-lg text-gray-600">Escape Pod Admin</h2>
        <h1 className="text-xl font-bold">Login</h1>
        <form className="mt-6" method="POST" onSubmit={handleSubmit}>
          { !isMutating && error !== undefined && (
            <span className="mb-2 block">
              {error.cause.status === 400 ? 'Invalid username or password' : 'Something went wrong. Please try again'}
            </span>
          ) }
          <input className="p-2 rounded bg-gray-100 border-2 border-gray-300 w-full" placeholder="Username" name="username" required />
          <input className="p-2 mt-2 rounded bg-gray-100 border-2 border-gray-300 w-full" placeholder="Password" name="password" type="password" required />
          <button className="bg-gray-800 text-white p-2 flex items-center justify-center rounded mt-2 w-full disabled:bg-gray-500" disabled={isMutating}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
