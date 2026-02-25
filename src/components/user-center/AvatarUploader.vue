<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { validateAvatarFile } from '@/views/user-center/avatar-utils'

const emit = defineEmits<{
  selected: [file: globalThis.File]
  invalid: [message: string]
}>()

const fileInputRef = ref<globalThis.HTMLInputElement | null>(null)
const { t } = useI18n()

function openPicker() {
  fileInputRef.value?.click()
}

function handleFileChange(event: globalThis.Event) {
  const input = event.target as globalThis.HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const result = validateAvatarFile(file)
  if (!result.valid) {
    const messageKey =
      result.code === 'invalid_type'
        ? 'userCenter.avatar.errors.invalidType'
        : 'userCenter.avatar.errors.oversize'
    emit('invalid', t(messageKey))
    input.value = ''
    return
  }

  emit('selected', file)
}
</script>

<template>
  <div class="space-y-2">
    <button class="btn" type="button" data-testid="avatar-upload-trigger" @click="openPicker">
      {{ t('userCenter.avatar.change') }}
    </button>
    <p class="text-xs text-slate-500 dark:text-slate-300">
      {{ t('userCenter.avatar.hint') }}
    </p>
    <input
      ref="fileInputRef"
      class="hidden"
      type="file"
      accept="image/png"
      data-testid="avatar-upload-input"
      @change="handleFileChange"
    />
  </div>
</template>
