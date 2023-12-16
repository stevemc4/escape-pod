const fetcher = (url: string, options?: RequestInit) => fetch(url, options).then(res => res.json())

interface MutatorOptions {
  method: 'POST' | 'PUT' | 'DELETE';
  auth: boolean;
  payload?: Record<string, unknown>;
}

const mutator = async (url: string, { arg }: { arg: MutatorOptions } = { arg: { method: 'POST', auth: true } }) => {
  const options: RequestInit = {
    method: arg.method,
    headers: {}
  }

  if (arg.payload !== undefined) {
    (options.headers as Record<string, string>)['Content-Type'] = 'application/json'
    options.body = JSON.stringify(arg.payload)
  }

  if (arg.auth) {
    (options.headers as Record<string, string>).Authorization = `Bearer ${localStorage.getItem('token')}`
  }

  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json()
    const err = new Error(body.error.message)
    err.cause = body

    throw err
  }

  return await res.json()
}

export default fetcher
export { mutator }
