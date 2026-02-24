import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/api/auth', () => ({
  loginApi: vi.fn().mockResolvedValue({ token: 'token_123', expiresIn: 7200 }),
  fetchCurrentUser: vi.fn().mockResolvedValue({
    id: 'u_1',
    name: 'Admin',
    roles: ['admin'],
    permissions: ['dashboard:view'],
  }),
  logoutApi: vi.fn().mockResolvedValue({ success: true }),
}))

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('persists token after login', async () => {
    const store = useAuthStore()
    await store.login('admin', '123456')

    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('app_token')).toBe('token_123')
  })

  it('clears token on logout', async () => {
    const store = useAuthStore()
    store.setToken('token_123')
    await store.logout()

    expect(store.token).toBeNull()
    expect(localStorage.getItem('app_token')).toBeNull()
  })

  it('can clear local session without request', async () => {
    const store = useAuthStore()
    store.setToken('token_123')
    await store.logout({ skipRequest: true })

    expect(store.token).toBeNull()
    expect(localStorage.getItem('app_token')).toBeNull()
  })
})
