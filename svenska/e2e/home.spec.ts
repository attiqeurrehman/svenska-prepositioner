import { test, expect } from '@playwright/test'

test.describe('Home screen', () => {
  test('shows the app title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Svenska Prepositioner')
  })

  test('shows all three activity cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('nav-flashcards')).toBeVisible()
    await expect(page.getByTestId('nav-quiz')).toBeVisible()
    await expect(page.getByTestId('nav-drag')).toBeVisible()
  })

  test('shows all 8 prepositions in cheat-sheet', async ({ page }) => {
    await page.goto('/')
    const prepositions = ['på', 'under', 'i', 'bakom', 'framför', 'bredvid', 'över', 'mellan']
    for (const p of prepositions) {
      await expect(page.getByText(p).first()).toBeVisible()
    }
  })
})
