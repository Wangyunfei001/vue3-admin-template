import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@/types/auth'
import { fetchCurrentUser, loginApi, logoutApi } from '@/api/auth'

const TOKEN_KEY = 'app_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(nextToken: string | null) {
    token.value = nextToken
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
      return
    }
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(username: string, password: string) {
    const payload = await loginApi({ username, password })
    setToken(payload.token)
    await hydrateUser()
  }

  async function hydrateUser() {
    if (!token.value) {
      user.value = null
      return
    }
    user.value = await fetchCurrentUser()
  }

  function clearSession() {
    user.value = null
    setToken(null)
  }

  async function logout(options?: { skipRequest?: boolean }) {
    clearSession()
    if (options?.skipRequest) return
    await logoutApi()
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    clearSession,
    hydrateUser,
    setToken,
  }
})
