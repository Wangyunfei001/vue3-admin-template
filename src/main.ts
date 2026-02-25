import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupRouter } from '@/router'
import { i18n, syncLocale } from '@/i18n'
import { setupTheme } from '@/app/bootstrap'
import '@/styles/main.css'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { setupMock } = await import('@/app/mock')
    setupMock()
  }

  setupTheme()

  const app = createApp(App)
  app.use(createPinia())
  app.use(i18n)
  syncLocale()
  app.use(setupRouter())
  app.mount('#app')
}

bootstrap()
globalThis.console.log('hook test')
