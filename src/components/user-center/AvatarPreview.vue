<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  src: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="card">
    <p class="text-sm font-semibold">{{ t('userCenter.avatar.previewTitle') }}</p>
    <div class="mt-3 flex items-center gap-3">
      <img
        :src="src"
        alt="avatar-preview"
        class="h-20 w-20 rounded-full border border-slate-200 object-cover dark:border-slate-600"
        data-testid="avatar-preview-image"
      />
      <p class="text-sm text-slate-600 dark:text-slate-300">{{ t('userCenter.avatar.previewDesc') }}</p>
    </div>
  </div>
</template>
