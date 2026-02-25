import { httpClient, request } from '@/lib/http/client'
import type {
  AvatarCropPayload,
  UpdateUserProfileRequest,
  UploadAvatarResponse,
  UserProfile,
} from '@/types/user'

export function fetchUserProfile() {
  return request<UserProfile>(httpClient.get('/user/profile'))
}

export function updateUserProfile(payload: UpdateUserProfileRequest) {
  return request<UserProfile>(httpClient.put('/user/profile', payload))
}

export function uploadUserAvatar(payload: AvatarCropPayload) {
  const formData = new globalThis.FormData()
  formData.append('file', payload.blob, payload.filename)
  return request<UploadAvatarResponse>(httpClient.post('/user/avatar', formData))
}
