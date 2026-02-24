import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    if (authStore.isAuthenticated && !authStore.user) {
      try {
        await authStore.hydrateUser()
      } catch {
        authStore.clearSession()
        return { path: '/login', query: { redirect: to.fullPath } }
      }
    }
    permissionStore.setPermissions(authStore.user?.permissions ?? [])

    if (to.meta.permissions?.length) {
      const hasAllPermissions = to.meta.permissions.every((permission) =>
        permissionStore.hasPermission(permission),
      )
      if (!hasAllPermissions) {
        return { path: '/403' }
      }
    }

    if (to.meta.roles?.length) {
      const userRoles = authStore.user?.roles ?? []
      const hasRole = to.meta.roles.some((role) => userRoles.includes(role))
      if (!hasRole) {
        return { path: '/403' }
      }
    }

    return true
  })
}
