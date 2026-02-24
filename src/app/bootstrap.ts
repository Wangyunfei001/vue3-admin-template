export function setupTheme() {
  const mode = localStorage.getItem('app_theme_mode') ?? 'system'
  const primaryColor = localStorage.getItem('app_theme_primary_color') ?? '#3b82f6'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark)

  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.setProperty('--color-primary', primaryColor)
}
