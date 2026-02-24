import { ref } from 'vue'
import { defineStore } from 'pinia'

export type AppLocale = 'zh-CN' | 'en-US'

const LOCALE_KEY = 'app_locale'

export const useAppStore = defineStore('app', () => {
  const locale = ref<AppLocale>((localStorage.getItem(LOCALE_KEY) as AppLocale) || 'zh-CN')
  const sidebarCollapsed = ref(false)

  function setLocale(nextLocale: AppLocale) {
    locale.value = nextLocale
    localStorage.setItem(LOCALE_KEY, nextLocale)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    locale,
    sidebarCollapsed,
    setLocale,
    toggleSidebar,
  }
})
