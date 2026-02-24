import { httpClient, request } from '@/lib/http/client'
import type { AuthUser, LoginRequest, LoginResponse } from '@/types/auth'

export function loginApi(payload: LoginRequest) {
  return request<LoginResponse>(httpClient.post('/auth/login', payload))
}

export function fetchCurrentUser() {
  return request<AuthUser>(httpClient.get('/auth/me'))
}

export function logoutApi() {
  return request<{ success: true }>(httpClient.post('/auth/logout'))
}
