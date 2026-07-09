import { test, expect } from '@playwright/test'

test.describe('Flashcards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-flashcards').click()
  })

  test('navigates to flashcards section', async ({ page }) => {
    await expect(page.getByTestId('flashcards-section')).toBeVisible()
  })

  test('shows first card with counter 1/8', async ({ page }) => {
    await expect(page.getByTestId('flashcard')).toBeVisible()
    await expect(page.getByText('1 / 8')).toBeVisible()
  })

  test('flips card on click to show English meaning', async ({ page }) => {
    await page.getByTestId('flashcard-card').click()
    await expect(page.getByTestId('flashcard-card')).toContainText('ON')
  })

  test('navigates to next card', async ({ page }) => {
    await page.getByTestId('flashcard-next').click()
    await expect(page.getByText('2 / 8')).toBeVisible()
  })

  test('back button returns to home', async ({ page }) => {
    await page.getByTestId('home-button').click()
    await expect(page.getByTestId('home')).toBeVisible()
  })
})
