export interface UserProfile {
  id: string
  nickname: string
  email?: string
  phone?: string
  avatarUrl: string
}

export interface UpdateUserProfileRequest {
  nickname?: string
}

export interface UploadAvatarResponse {
  avatarUrl: string
}

export interface AvatarCropPayload {
  blob: globalThis.Blob
  filename: string
  width: number
  height: number
}
