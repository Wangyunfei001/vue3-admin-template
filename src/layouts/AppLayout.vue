<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { fetchMenus } from '@/api/navigation'
import type { MenuItem } from '@/types/navigation'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const menus = ref<MenuItem[]>([])
const menuError = ref('')

async function loadMenus() {
  try {
    menus.value = await fetchMenus(appStore.locale)
    menuError.value = ''
  } catch {
    menus.value = []
    menuError.value = t('layout.menuLoadFailed')
  }
}

async function handleLogout() {
  await authStore.logout()
  await router.push('/login')
}

onMounted(() => {
  void loadMenus()
})

watch(
  () => appStore.locale,
  () => {
    void loadMenus()
  },
)
</script>

<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <header class="px-4 pt-5">
      <div class="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">{{ t('layout.adminTemplate') }}</p>
          <h1 class="text-base font-semibold">{{ t('appTitle') }}</h1>
        </div>
        <div class="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeSwitch />
          <button class="btn" @click="handleLogout">{{ t('common.logout') }}</button>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-6xl gap-4 px-4 py-4">
      <aside
        :class="[
          'glass w-60 rounded-2xl p-3',
          { hidden: appStore.sidebarCollapsed, 'block sm:block': !appStore.sidebarCollapsed },
        ]"
      >
        <p class="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">{{ t('layout.navigation') }}</p>
        <p v-if="menuError" class="mb-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {{ menuError }}
        </p>
        <ul class="space-y-2">
          <li v-for="menu in menus" :key="menu.id">
            <RouterLink :to="menu.path" class="menu-link">
              {{ menu.title }}
            </RouterLink>
          </li>
        </ul>
      </aside>

      <main class="glass flex-1 rounded-2xl p-5">
        <button class="mb-3 text-sm text-(--color-primary) sm:hidden" @click="appStore.toggleSidebar">
          {{ t('layout.toggleNavigation') }}
        </button>
        <RouterView />
      </main>
    </div>
  </div>
</template>
