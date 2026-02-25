import type { ApiError } from '@/types/api'

export const AVATAR_MAX_SIZE_BYTES = 10 * 1024 * 1024
export const AVATAR_ACCEPTED_MIME = 'image/png'

export interface AvatarValidationResult {
  valid: boolean
  code?: 'invalid_type' | 'oversize'
}

export function validateAvatarFile(file: globalThis.File): AvatarValidationResult {
  if (file.type !== AVATAR_ACCEPTED_MIME) {
    return { valid: false, code: 'invalid_type' }
  }
  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return { valid: false, code: 'oversize' }
  }
  return { valid: true }
}

export function buildAvatarFilename() {
  return `avatar-${Date.now()}.png`
}

export function mapAvatarApiError(code: number) {
  if (code === 413 || code === 41301) return 'userCenter.avatar.errors.oversize'
  if (code === 415 || code === 41501) return 'userCenter.avatar.errors.invalidType'
  if (code === 401 || code === 40101) return 'userCenter.avatar.errors.unauthorized'
  if (code === 422 || code === 42201) return 'userCenter.avatar.errors.business'
  return 'userCenter.avatar.errors.server'
}

export function toApiError(error: unknown): ApiError {
  const fallback = new Error('Unknown Error') as ApiError
  fallback.code = 50000

  if (!error || typeof error !== 'object') return fallback
  if (!('code' in error)) return fallback
  const maybeCode = (error as { code?: unknown }).code
  if (typeof maybeCode !== 'number') return fallback
  return error as ApiError
}
