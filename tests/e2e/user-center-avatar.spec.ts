import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'

test('uploads avatar with crop flow', async ({ page }) => {
  await page.goto('/login')
  await page.getByTestId('username-input').fill('admin')
  await page.getByTestId('password-input').fill('123456')
  await page.getByTestId('login-submit').click()

  await page.goto('/user-center')
  await expect(page.getByText(/用户中心|User Center/i)).toBeVisible()

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
  await page.goto('/login')
  await page.getByTestId('username-input').fill('admin')
  await page.getByTestId('password-input').fill('123456')
  await page.getByTestId('login-submit').click()

  await page.goto('/user-center')
  await expect(page.getByText(/用户中心|User Center/i)).toBeVisible()

  await page.getByTestId('avatar-upload-input').setInputFiles({
    name: 'avatar.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('fake-jpg'),
  })

  await expect(page.getByTestId('user-center-error')).toBeVisible()
})
