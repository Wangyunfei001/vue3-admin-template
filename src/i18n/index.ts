import { createI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export function syncLocale() {
  const appStore = useAppStore()
  i18n.global.locale.value = appStore.locale
}
