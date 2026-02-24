import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'
import { setupRouterGuards } from '@/router/guards'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export function setupRouter() {
  setupRouterGuards(router)
  return router
}
