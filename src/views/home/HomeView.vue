<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
</script>

<template>
  <section>
    <div class="mb-6 rounded-2xl border border-indigo-200/70 bg-linear-to-r from-indigo-50/90 via-cyan-50/80 to-indigo-50/90 p-5 dark:border-indigo-500/30 dark:from-indigo-900/35 dark:via-cyan-900/20 dark:to-indigo-900/35">
      <p class="text-xs uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-200">{{ t('home.dashboard') }}</p>
      <h2 class="mt-1 text-2xl font-bold">{{ t('home.welcome') }}, {{ authStore.user?.name ?? 'User' }}</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-300">{{ t('home.description') }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article class="card">
        <p class="text-xs uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">{{ t('home.cards.coreLabel') }}</p>
        <h3 class="mt-1 font-semibold">{{ t('home.cards.vueTitle') }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ t('home.cards.vueDesc') }}</p>
      </article>
      <article class="card">
        <p class="text-xs uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">{{ t('home.cards.qualityLabel') }}</p>
        <h3 class="mt-1 font-semibold">{{ t('home.cards.tsTitle') }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ t('home.cards.tsDesc') }}</p>
      </article>
      <article class="card">
        <p class="text-xs uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">{{ t('home.cards.experienceLabel') }}</p>
        <h3 class="mt-1 font-semibold">{{ t('home.cards.tailwindTitle') }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ t('home.cards.tailwindDesc') }}</p>
      </article>
    </div>
  </section>
</template>
