import { expect, test } from '@playwright/test'

test('login then view home', async ({ page }) => {
  await page.goto('/login')
  await page.getByTestId('username-input').fill('admin')
  await page.getByTestId('password-input').fill('123456')
  await page.getByTestId('login-submit').click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText(/welcome|欢迎/i)).toBeVisible()
})

test('redirect to login when visiting protected route', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)
})
