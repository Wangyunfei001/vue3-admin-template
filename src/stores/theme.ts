import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_MODE_KEY = 'app_theme_mode'
const THEME_PRIMARY_COLOR_KEY = 'app_theme_primary_color'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>((localStorage.getItem(THEME_MODE_KEY) as ThemeMode) || 'system')
  const primaryColor = ref(localStorage.getItem(THEME_PRIMARY_COLOR_KEY) || '#3b82f6')

  const resolvedDark = computed(() => {
    if (mode.value === 'dark') return true
    if (mode.value === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  function setMode(nextMode: ThemeMode) {
    mode.value = nextMode
    localStorage.setItem(THEME_MODE_KEY, nextMode)
  }

  function setPrimaryColor(color: string) {
    primaryColor.value = color
    localStorage.setItem(THEME_PRIMARY_COLOR_KEY, color)
  }

  function applyThemeToDom() {
    document.documentElement.classList.toggle('dark', resolvedDark.value)
    document.documentElement.style.setProperty('--color-primary', primaryColor.value)
  }

  return {
    mode,
    primaryColor,
    resolvedDark,
    setMode,
    setPrimaryColor,
    applyThemeToDom,
  }
})
