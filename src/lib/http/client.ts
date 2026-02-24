import axios from 'axios'
import type { ApiError, ApiFail, ApiSuccess } from '@/types/api'
import { useAuthStore } from '@/stores/auth'
import { router } from '@/router'

interface HttpConfig {
  baseURL: string
}

const config: HttpConfig = {
  baseURL: '/api',
}

export const httpClient = axios.create({
  baseURL: config.baseURL,
  timeout: 10_000,
})

let isHandlingUnauthorized = false

httpClient.interceptors.request.use((request) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    request.headers.Authorization = `Bearer ${authStore.token}`
  }
  return request
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error.response?.data as ApiFail | undefined
    const normalizedError = new Error(response?.message ?? 'Request failed') as ApiError
    normalizedError.code = response?.code ?? error.response?.status ?? 50000
    normalizedError.requestId = response?.requestId

    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true
      const authStore = useAuthStore()
      try {
        await authStore.logout({ skipRequest: true })
        if (router.currentRoute.value.path !== '/login') {
          await router.push('/login')
        }
      } finally {
        isHandlingUnauthorized = false
      }
    }

    return Promise.reject(normalizedError)
  },
)

export async function request<T>(promise: Promise<{ data: ApiSuccess<T> | ApiFail }>) {
  const response = await promise
  const payload = response.data
  if (payload.code !== 0) {
    const err = new Error(payload.message || 'Business request failed') as ApiError
    err.code = payload.code
    if ('requestId' in payload) {
      err.requestId = payload.requestId
    }
    throw err
  }
  return (payload as ApiSuccess<T>).data
}
