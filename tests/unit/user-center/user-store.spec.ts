import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '@/stores/user'

vi.mock('@/api/user', () => ({
  fetchUserProfile: vi.fn().mockResolvedValue({
    id: 'u_1001',
    nickname: 'Admin User',
    email: 'admin@example.com',
    phone: '13800000000',
    avatarUrl: 'https://cdn.example.com/avatar/u_1001.png',
  }),
  updateUserProfile: vi.fn().mockImplementation(async (payload: { nickname?: string }) => ({
    id: 'u_1001',
    nickname: payload.nickname ?? 'Admin User',
    email: 'admin@example.com',
    phone: '13800000000',
    avatarUrl: 'https://cdn.example.com/avatar/u_1001.png',
  })),
  uploadUserAvatar: vi.fn().mockResolvedValue({
    avatarUrl: 'https://cdn.example.com/avatar/u_1001_v2.png',
  }),
}))

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads profile and updates status', async () => {
    const store = useUserStore()
    await store.loadProfile()
    expect(store.profileStatus).toBe('success')
    expect(store.profile?.nickname).toBe('Admin User')
  })

  it('saves profile nickname', async () => {
    const store = useUserStore()
    await store.loadProfile()
    await store.saveProfile('New Nick')
    expect(store.saveProfileStatus).toBe('success')
    expect(store.profile?.nickname).toBe('New Nick')
  })

  it('saves avatar and syncs avatar url', async () => {
    const store = useUserStore()
    await store.loadProfile()
    const blob = new globalThis.Blob([new Uint8Array([1, 2])], { type: 'image/png' })
    await store.saveAvatar({
      blob,
      filename: 'avatar.png',
      width: 320,
      height: 320,
    })
    expect(store.uploadStatus).toBe('success')
    expect(store.profile?.avatarUrl).toContain('u_1001_v2')
  })
})
