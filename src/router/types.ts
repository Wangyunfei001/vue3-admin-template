import type { RouteLocationNormalized } from 'vue-router'

export interface RoutePermissionMeta {
  requiresAuth?: boolean
  roles?: string[]
  permissions?: string[]
}

export type AuthRoute = RouteLocationNormalized & {
  meta: RoutePermissionMeta
}
