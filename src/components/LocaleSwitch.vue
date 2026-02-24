<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, type AppLocale } from '@/stores/app'
import { i18n } from '@/i18n'

const appStore = useAppStore()
const { t } = useI18n()

const locale = computed({
  get: () => appStore.locale,
  set: (value) => appStore.setLocale(value as AppLocale),
})

watch(
  () => appStore.locale,
  (value) => {
    i18n.global.locale.value = value
  },
  { immediate: true },
)
</script>

<template>
  <select
    v-model="locale"
    class="rounded-xl border border-indigo-200/80 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition focus:border-indigo-400 focus:outline-none dark:border-indigo-400/40 dark:bg-slate-900/60 dark:text-slate-100"
  >
    <option value="zh-CN">中文</option>
    <option value="en-US">{{ t('labels.english') }}</option>
  </select>
</template>
