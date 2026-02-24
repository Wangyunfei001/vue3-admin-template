<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const form = reactive({
  username: 'admin',
  password: '123456',
})
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form.username, form.password)
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch {
    errorMessage.value = t('login.failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center p-4">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.18),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.14),transparent_32%)]"></div>
    <form
      class="glass relative z-10 w-full max-w-md rounded-3xl p-7"
      @submit.prevent="submit"
    >
      <p class="mb-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">{{ t('login.secureAccess') }}</p>
      <h1 class="mb-6 text-2xl font-semibold">{{ t('login.title') }}</h1>
      <label class="mb-4 block">
        <span class="mb-1 block text-sm font-medium">{{ t('login.username') }}</span>
        <input
          v-model="form.username"
          class="input"
          data-testid="username-input"
          required
          minlength="3"
          maxlength="32"
        />
      </label>
      <label class="mb-4 block">
        <span class="mb-1 block text-sm font-medium">{{ t('login.password') }}</span>
        <input
          v-model="form.password"
          type="password"
          class="input"
          data-testid="password-input"
          required
          minlength="6"
          maxlength="64"
        />
      </label>
      <p v-if="errorMessage" class="mb-3 rounded-lg bg-red-100/80 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-300">
        {{ errorMessage }}
      </p>
      <button type="submit" class="btn w-full" data-testid="login-submit" :disabled="loading">
        {{ loading ? t('login.signingIn') : t('login.submit') }}
      </button>
    </form>
  </div>
</template>
