import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { setupRouterGuards } from '@/router/guards'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

describe('router guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('redirects unauthenticated user to login', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: { template: '<div>login</div>' } },
        { path: '/secure', component: { template: '<div>secure</div>' }, meta: { requiresAuth: true } },
      ],
    })
    setupRouterGuards(router)
    await router.push('/secure')

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('redirects to 403 without permission', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/403', component: { template: '<div>forbidden</div>' } },
        { path: '/login', component: { template: '<div>login</div>' } },
        {
          path: '/admin',
          component: { template: '<div>admin</div>' },
          meta: { requiresAuth: true, permissions: ['admin:view'] },
        },
      ],
    })

    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()
    authStore.setToken('mock')
    authStore.hydrateUser = vi.fn().mockImplementation(async () => undefined)
    permissionStore.setPermissions([])

    setupRouterGuards(router)
    await router.push('/admin')

    expect(router.currentRoute.value.path).toBe('/403')
  })

  it('redirects to login when hydrate user fails', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/login', component: { template: '<div>login</div>' } },
        { path: '/secure', component: { template: '<div>secure</div>' }, meta: { requiresAuth: true } },
      ],
    })

    const authStore = useAuthStore()
    authStore.setToken('stale-token')
    authStore.hydrateUser = vi.fn().mockRejectedValue(new Error('token expired'))

    setupRouterGuards(router)
    await router.push('/secure')

    expect(router.currentRoute.value.path).toBe('/login')
    expect(authStore.token).toBeNull()
  })
})
