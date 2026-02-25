import type MockAdapter from 'axios-mock-adapter'

const MOCK_TOKEN = 'mock-jwt-token'

interface MockUserProfile {
  id: string
  nickname: string
  email: string
  phone: string
  avatarUrl: string
}

let profile: MockUserProfile = {
  id: 'u_1001',
  nickname: 'Admin User',
  email: 'admin@example.com',
  phone: '13800000000',
  avatarUrl: 'https://cdn.example.com/avatar/u_1001.png',
}

function unauthorized() {
  return [401, { code: 40101, message: 'Unauthorized' }] as [number, { code: number; message: string }]
}

export function registerAuthMocks(mock: MockAdapter) {
  mock.onPost('/auth/login').reply((config) => {
    const body = JSON.parse(config.data || '{}') as { username?: string; password?: string }
    if (body.username === 'admin' && body.password === '123456') {
      return [200, { code: 0, message: 'ok', data: { token: MOCK_TOKEN, expiresIn: 7200 } }]
    }
    return [401, { code: 40101, message: 'Invalid credentials' }]
  })

  mock.onGet('/auth/me').reply((config) => {
    if (config.headers?.Authorization !== `Bearer ${MOCK_TOKEN}`) {
      return unauthorized()
    }
    return [
      200,
      {
        code: 0,
        message: 'ok',
        data: {
          id: 'u_1001',
          name: 'Admin User',
          avatarUrl: profile.avatarUrl,
          roles: ['admin'],
          permissions: ['dashboard:view', 'system:forbidden:view'],
        },
      },
    ]
  })

  mock.onPost('/auth/logout').reply(200, { code: 0, message: 'ok', data: { success: true } })

  mock.onGet('/user/profile').reply((config) => {
    if (config.headers?.Authorization !== `Bearer ${MOCK_TOKEN}`) {
      return unauthorized()
    }
    return [200, { code: 0, message: 'ok', data: profile }]
  })

  mock.onPut('/user/profile').reply((config) => {
    if (config.headers?.Authorization !== `Bearer ${MOCK_TOKEN}`) {
      return unauthorized()
    }
    const body = JSON.parse(config.data || '{}') as { nickname?: string }
    if (typeof body.nickname === 'string') {
      const nextNickname = body.nickname.trim()
      if (!nextNickname || nextNickname.length > 32) {
        return [422, { code: 42201, message: 'Nickname is invalid' }]
      }
      profile = { ...profile, nickname: nextNickname }
    }
    return [200, { code: 0, message: 'ok', data: profile }]
  })

  mock.onPost('/user/avatar').reply((config) => {
    if (config.headers?.Authorization !== `Bearer ${MOCK_TOKEN}`) {
      return unauthorized()
    }

    const formData = config.data as globalThis.FormData | undefined
    const file = formData?.get('file')
    if (!(typeof globalThis.File !== 'undefined' && file instanceof globalThis.File)) {
      return [400, { code: 40001, message: 'Missing file field' }]
    }
    if (file.type !== 'image/png') {
      return [415, { code: 41501, message: 'Only PNG is supported' }]
    }
    if (file.size > 10 * 1024 * 1024) {
      return [413, { code: 41301, message: 'File too large' }]
    }

    profile = {
      ...profile,
      avatarUrl: `https://cdn.example.com/avatar/u_1001_${Date.now()}.png`,
    }
    return [200, { code: 0, message: 'ok', data: { avatarUrl: profile.avatarUrl } }]
  })
}
