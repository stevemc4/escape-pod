export interface ResponseShape<T = unknown> {
  status: number;
  payload?: T;
  error?: {
    message: string;
    detail?: T;
  }
}

export function success<T = unknown> (body: T, status = 200): ResponseShape<T> {
  return {
    status,
    payload: body
  }
}

export function error<T = unknown> (status: number, message: string, detail: T | undefined = undefined): Omit<ResponseShape<T>, 'payload'> {
  return {
    status,
    error: {
      message,
      detail
    }
  }
}

export function unauthorized<T = unknown> (message = 'Unauthorized', detail: T | undefined = undefined) {
  return Response.json(error<T>(401, message, detail), { status: 401 })
}

export function badRequest<T = unknown> (message = 'Bad Request', detail: T | undefined = undefined) {
  return Response.json(error<T>(400, message, detail), { status: 400 })
}

export function unprocessable<T = unknown> (message = 'Unprocessable Entity', detail: T | undefined = undefined) {
  return Response.json(error<T>(422, message, detail), { status: 422 })
}
