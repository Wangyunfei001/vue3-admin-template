import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const permissions = ref<string[]>([])

  function setRoutes(nextRoutes: RouteRecordRaw[]) {
    routes.value = nextRoutes
  }

  function setPermissions(nextPermissions: string[]) {
    permissions.value = nextPermissions
  }

  function hasPermission(permission: string) {
    return permissions.value.includes(permission)
  }

  return {
    routes,
    permissions,
    setRoutes,
    setPermissions,
    hasPermission,
  }
})
