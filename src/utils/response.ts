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

export function error<T = unknown> (status: number, message: string, detail: T | undefined = undefined) {
  return {
    status,
    error: {
      message,
      detail
    }
  }
}
