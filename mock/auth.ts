import type MockAdapter from 'axios-mock-adapter'

const MOCK_TOKEN = 'mock-jwt-token'

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
          roles: ['admin'],
          permissions: ['dashboard:view', 'system:forbidden:view'],
        },
      },
    ]
  })

  mock.onPost('/auth/logout').reply(200, { code: 0, message: 'ok', data: { success: true } })
}
