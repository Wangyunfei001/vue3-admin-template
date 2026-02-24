import MockAdapter from 'axios-mock-adapter'
import { httpClient } from '@/lib/http/client'
import { registerAuthMocks } from '../../mock/auth'
import { registerNavigationMocks } from '../../mock/navigation'

let initialized = false

export function setupMock() {
  if (initialized) return

  const mock = new MockAdapter(httpClient, {
    delayResponse: Number(import.meta.env.VITE_MOCK_DELAY ?? 200),
  })

  registerAuthMocks(mock)
  registerNavigationMocks(mock)
  initialized = true
}
