<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UserProfile } from '@/types/user'

const props = defineProps<{
  profile: UserProfile | null
  loading: boolean
}>()

const emit = defineEmits<{
  save: [nickname: string]
}>()

const { t } = useI18n()
const form = reactive({
  nickname: '',
})

watch(
  () => props.profile,
  (profile) => {
    form.nickname = profile?.nickname ?? ''
  },
  { immediate: true },
)

function handleSubmit() {
  emit('save', form.nickname)
}
</script>

<template>
  <form class="card" @submit.prevent="handleSubmit">
    <h3 class="text-base font-semibold">{{ t('userCenter.profile.title') }}</h3>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <label class="space-y-1">
        <span class="text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.profile.nickname') }}</span>
        <input v-model="form.nickname" class="input" type="text" maxlength="32" data-testid="profile-nickname-input" />
      </label>
      <label class="space-y-1">
        <span class="text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.profile.email') }}</span>
        <input :value="profile?.email ?? '-'" class="input" type="text" readonly disabled />
      </label>
      <label class="space-y-1">
        <span class="text-xs text-slate-500 dark:text-slate-300">{{ t('userCenter.profile.phone') }}</span>
        <input :value="profile?.phone ?? '-'" class="input" type="text" readonly disabled />
      </label>
    </div>

    <div class="mt-4">
      <button class="btn" type="submit" data-testid="profile-save-button" :disabled="loading">
        {{ loading ? t('userCenter.profile.saving') : t('userCenter.profile.save') }}
      </button>
    </div>
  </form>
</template>
