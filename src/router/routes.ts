import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { requiresAuth: true, permissions: ['dashboard:view'] },
      },
      {
        path: 'forbidden-demo',
        name: 'forbidden-demo',
        component: () => import('@/views/error/ForbiddenView.vue'),
        meta: { requiresAuth: true, permissions: ['system:forbidden:view'] },
      },
      {
        path: 'user-center',
        name: 'user-center',
        component: () => import('@/views/user-center/UserCenterView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/ForbiddenView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
]
