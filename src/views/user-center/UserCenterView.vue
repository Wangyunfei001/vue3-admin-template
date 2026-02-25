<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileForm from '@/components/user-center/ProfileForm.vue'
import AvatarUploader from '@/components/user-center/AvatarUploader.vue'
import AvatarCropDialog from '@/components/user-center/AvatarCropDialog.vue'
import AvatarPreview from '@/components/user-center/AvatarPreview.vue'
import { useUserStore } from '@/stores/user'
import { mapAvatarApiError, toApiError } from '@/views/user-center/avatar-utils'
import type { AvatarCropPayload } from '@/types/user'

const userStore = useUserStore()
const { t } = useI18n()

const message = ref('')
const error = ref('')
const selectedFile = ref<globalThis.File | null>(null)
const cropVisible = ref(false)
const previewUrl = ref('')

const currentAvatar = computed(() => previewUrl.value || userStore.profile?.avatarUrl || '')

async function loadProfile() {
  try {
    await userStore.loadProfile()
  } catch {
    error.value = t('userCenter.errors.loadFailed')
  }
}

async function handleSaveProfile(nickname: string) {
  message.value = ''
  error.value = ''
  try {
    await userStore.saveProfile(nickname)
    message.value = t('userCenter.profile.saveSuccess')
  } catch {
    error.value = t('userCenter.profile.saveFailed')
  }
}

function handleSelectFile(file: globalThis.File) {
  error.value = ''
  selectedFile.value = file
  cropVisible.value = true
}

function handleInvalidFile(messageText: string) {
  message.value = ''
  error.value = messageText
}

function closeCropDialog() {
  cropVisible.value = false
}

function handleCropError(messageText: string) {
  error.value = messageText
}

async function handleCropConfirm(payload: AvatarCropPayload, nextPreviewUrl: string) {
  message.value = ''
  error.value = ''
  try {
    await userStore.saveAvatar(payload)
    previewUrl.value = nextPreviewUrl
    cropVisible.value = false
    message.value = t('userCenter.avatar.saveSuccess')
  } catch (rawError) {
    globalThis.URL.revokeObjectURL(nextPreviewUrl)
    const apiError = toApiError(rawError)
    error.value = t(mapAvatarApiError(apiError.code))
  }
}

onMounted(() => {
  void loadProfile()
})
</script>

<template>
  <section class="space-y-4">
    <header>
      <p class="text-xs uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">{{ t('userCenter.title') }}</p>
      <h2 class="mt-1 text-2xl font-semibold">{{ t('userCenter.subtitle') }}</h2>
    </header>

    <p v-if="message" class="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
      {{ message }}
    </p>
    <p v-if="error" class="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200" data-testid="user-center-error">
      {{ error }}
    </p>

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <ProfileForm
          :profile="userStore.profile"
          :loading="userStore.saveProfileStatus === 'loading'"
          @save="handleSaveProfile"
        />
      </div>

      <div class="space-y-4">
        <div class="card">
          <h3 class="text-base font-semibold">{{ t('userCenter.avatar.title') }}</h3>
          <div class="mt-3 flex items-center gap-3">
            <img
              v-if="currentAvatar"
              :src="currentAvatar"
              alt="avatar"
              class="h-20 w-20 rounded-full border border-slate-200 object-cover dark:border-slate-600"
              data-testid="user-center-avatar"
            />
            <div
              v-else
              class="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-300 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-300"
            >
              N/A
            </div>
            <AvatarUploader @selected="handleSelectFile" @invalid="handleInvalidFile" />
          </div>
        </div>

        <AvatarPreview v-if="currentAvatar" :src="currentAvatar" />
      </div>
    </div>

    <AvatarCropDialog
      :file="selectedFile"
      :visible="cropVisible"
      @close="closeCropDialog"
      @confirm="handleCropConfirm"
      @error="handleCropError"
    />
  </section>
</template>
