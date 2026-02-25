import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByTestId('username-input').fill('admin')
  await page.getByTestId('password-input').fill('123456')
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL('/')
}

test('uploads avatar with crop flow', async ({ page }) => {
  await loginAsAdmin(page)

  await page.goto('/user-center')
  await expect(page).toHaveURL(/\/user-center$/)
  await expect(page.getByTestId('avatar-upload-trigger')).toBeVisible({ timeout: 10_000 })

  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y4f9l0AAAAASUVORK5CYII=',
    'base64',
  )
  await page.getByTestId('avatar-upload-input').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: pngBuffer,
  })

  await expect(page.getByTestId('avatar-crop-stage')).toBeVisible()
  await page.getByTestId('avatar-crop-confirm').click()

  await expect(page.getByTestId('avatar-preview-image')).toBeVisible()
})

test('rejects non-png avatar file', async ({ page }) => {
  await loginAsAdmin(page)

  await page.goto('/user-center')
  await expect(page).toHaveURL(/\/user-center$/)
  await expect(page.getByTestId('avatar-upload-trigger')).toBeVisible({ timeout: 10_000 })

  await page.getByTestId('avatar-upload-input').setInputFiles({
    name: 'avatar.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-jpg'),
  })

  await expect(page.getByTestId('user-center-error')).toBeVisible()
})
