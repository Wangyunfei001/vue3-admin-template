import { describe, expect, it } from 'vitest'
import {
  AVATAR_MAX_SIZE_BYTES,
  buildAvatarFilename,
  mapAvatarApiError,
  validateAvatarFile,
} from '@/views/user-center/avatar-utils'

describe('avatar utils', () => {
  it('validates png file within limit', () => {
    const file = new globalThis.File([new Uint8Array([1, 2, 3])], 'avatar.png', { type: 'image/png' })
    const result = validateAvatarFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects unsupported mime type', () => {
    const file = new globalThis.File([new Uint8Array([1, 2, 3])], 'avatar.jpg', { type: 'image/jpeg' })
    const result = validateAvatarFile(file)
    expect(result).toEqual({ valid: false, code: 'invalid_type' })
  })

  it('rejects oversized file', () => {
    const bytes = new Uint8Array(AVATAR_MAX_SIZE_BYTES + 1)
    const file = new globalThis.File([bytes], 'avatar.png', { type: 'image/png' })
    const result = validateAvatarFile(file)
    expect(result).toEqual({ valid: false, code: 'oversize' })
  })

  it('maps api errors to i18n keys', () => {
    expect(mapAvatarApiError(413)).toBe('userCenter.avatar.errors.oversize')
    expect(mapAvatarApiError(41501)).toBe('userCenter.avatar.errors.invalidType')
    expect(mapAvatarApiError(401)).toBe('userCenter.avatar.errors.unauthorized')
    expect(mapAvatarApiError(422)).toBe('userCenter.avatar.errors.business')
    expect(mapAvatarApiError(500)).toBe('userCenter.avatar.errors.server')
  })

  it('builds png filename', () => {
    const filename = buildAvatarFilename()
    expect(filename.startsWith('avatar-')).toBe(true)
    expect(filename.endsWith('.png')).toBe(true)
  })
})
