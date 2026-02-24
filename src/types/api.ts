export interface ApiSuccess<T> {
  code: 0
  message: 'ok'
  data: T
}

export interface ApiFail {
  code: number
  message: string
  requestId?: string
}

export interface ApiError extends Error {
  code: number
  requestId?: string
}
