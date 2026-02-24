<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore, type ThemeMode } from '@/stores/theme'

const themeStore = useThemeStore()
const { t } = useI18n()

const mode = computed({
  get: () => themeStore.mode,
  set: (value) => themeStore.setMode(value as ThemeMode),
})

watch(
  () => [themeStore.mode, themeStore.primaryColor],
  () => themeStore.applyThemeToDom(),
  { immediate: true },
)
</script>

<template>
  <select
    v-model="mode"
    class="rounded-xl border border-indigo-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition focus:border-indigo-400 focus:outline-none dark:border-indigo-400/40 dark:bg-slate-900/60 dark:text-slate-100"
  >
    <option value="system">{{ t('theme.system') }}</option>
    <option value="light">{{ t('theme.light') }}</option>
    <option value="dark">{{ t('theme.dark') }}</option>
  </select>
</template>
