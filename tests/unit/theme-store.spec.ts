import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

describe('theme store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('updates mode and writes localStorage', () => {
    const store = useThemeStore()
    store.setMode('dark')
    expect(store.mode).toBe('dark')
    expect(localStorage.getItem('app_theme_mode')).toBe('dark')
  })

  it('applies theme class to dom', () => {
    const store = useThemeStore()
    store.setMode('light')
    store.applyThemeToDom()

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
