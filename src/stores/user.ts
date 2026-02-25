import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from '@/api/user'
import type { AvatarCropPayload, UserProfile } from '@/types/user'

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const profileStatus = ref<AsyncStatus>('idle')
  const saveProfileStatus = ref<AsyncStatus>('idle')
  const uploadStatus = ref<AsyncStatus>('idle')
  const cropStatus = ref<AsyncStatus>('idle')
  const errorMessage = ref<string | null>(null)

  const avatarUrl = computed(() => profile.value?.avatarUrl ?? '')

  function setProfile(nextProfile: UserProfile) {
    profile.value = nextProfile
  }

  function setAvatarUrl(nextAvatarUrl: string) {
    if (!profile.value) return
    profile.value = {
      ...profile.value,
      avatarUrl: nextAvatarUrl,
    }
  }

  function reset() {
    profile.value = null
    profileStatus.value = 'idle'
    saveProfileStatus.value = 'idle'
    uploadStatus.value = 'idle'
    cropStatus.value = 'idle'
    errorMessage.value = null
  }

  async function loadProfile() {
    profileStatus.value = 'loading'
    errorMessage.value = null
    try {
      const data = await fetchUserProfile()
      profile.value = data
      profileStatus.value = 'success'
      return data
    } catch (error) {
      profileStatus.value = 'error'
      errorMessage.value = (error as Error).message
      throw error
    }
  }

  async function saveProfile(nickname: string) {
    saveProfileStatus.value = 'loading'
    errorMessage.value = null
    try {
      const data = await updateUserProfile({ nickname: nickname.trim() })
      profile.value = data
      saveProfileStatus.value = 'success'
      return data
    } catch (error) {
      saveProfileStatus.value = 'error'
      errorMessage.value = (error as Error).message
      throw error
    }
  }

  async function saveAvatar(payload: AvatarCropPayload) {
    uploadStatus.value = 'loading'
    cropStatus.value = 'loading'
    errorMessage.value = null
    try {
      const data = await uploadUserAvatar(payload)
      setAvatarUrl(data.avatarUrl)
      uploadStatus.value = 'success'
      cropStatus.value = 'success'
      return data
    } catch (error) {
      uploadStatus.value = 'error'
      cropStatus.value = 'error'
      errorMessage.value = (error as Error).message
      throw error
    }
  }

  return {
    profile,
    profileStatus,
    saveProfileStatus,
    uploadStatus,
    cropStatus,
    errorMessage,
    avatarUrl,
    setProfile,
    setAvatarUrl,
    reset,
    loadProfile,
    saveProfile,
    saveAvatar,
  }
})
