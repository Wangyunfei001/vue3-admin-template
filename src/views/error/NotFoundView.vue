<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="flex min-h-[52vh] items-center justify-center py-10">
    <div class="glass w-full max-w-lg rounded-3xl p-8 text-center">
      <p class="text-xs uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">{{ t('error.routeMissing') }}</p>
      <h2 class="mt-2 text-4xl font-bold">404</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">{{ t('error.notFound') }}</p>
      <RouterLink to="/" class="btn mt-6 inline-flex">{{ t('error.backHome') }}</RouterLink>
    </div>
  </section>
</template>
