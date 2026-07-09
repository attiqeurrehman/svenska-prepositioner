import { test, expect } from '@playwright/test'

test.describe('Drag & Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-drag').click()
  })

  test('shows first scene instruction', async ({ page }) => {
    await expect(page.getByText('Put the cat ON the table')).toBeVisible()
  })

  test('tapping correct zone shows Perfekt', async ({ page }) => {
    await page.getByTestId('drop-zone-on').click()
    await expect(page.getByText(/Perfekt/)).toBeVisible()
  })

  test('tapping wrong zone shows the correct preposition', async ({ page }) => {
    await page.getByTestId('drop-zone-under').click()
    // feedback shows the correct preposition in quotes
    await expect(page.getByText(/på/)).toBeVisible()
  })

  test('advances to scene 2 after clicking next', async ({ page }) => {
    await page.getByTestId('drop-zone-on').click()
    await page.getByTestId('drag-next').click()
    await expect(page.getByText('Scene 2 of 5')).toBeVisible()
  })

  test('back button returns to home', async ({ page }) => {
    await page.getByTestId('home-button').click()
    await expect(page.getByTestId('home')).toBeVisible()
  })
})
