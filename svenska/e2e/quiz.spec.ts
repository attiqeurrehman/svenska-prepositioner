import { test, expect } from '@playwright/test'

test.describe('Quiz Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-quiz').click()
  })

  test('shows first question', async ({ page }) => {
    await expect(page.getByText(/Question 1/)).toBeVisible()
  })

  test('selecting correct answer shows positive feedback', async ({ page }) => {
    await page.getByTestId('quiz-option-på').click()
    await expect(page.getByText(/Perfekt/)).toBeVisible()
  })

  test('selecting wrong answer reveals correct answer', async ({ page }) => {
    await page.getByTestId('quiz-option-under').click()
    await expect(page.getByText(/It was/)).toBeVisible()
  })

  test('can advance to next question after answering', async ({ page }) => {
    await page.getByTestId('quiz-option-på').click()
    await page.getByTestId('quiz-next').click()
    await expect(page.getByText(/Question 2/)).toBeVisible()
  })

  test('shows star rating on home after completing quiz', async ({ page }) => {
    const answers = ['på', 'under', 'i', 'över', 'bredvid', 'bakom', 'framför', 'mellan']
    for (const answer of answers) {
      const btn = page.getByTestId(`quiz-option-${answer}`)
      if (await btn.isVisible()) {
        await btn.click()
      } else {
        await page.locator('[data-testid^="quiz-option-"]').first().click()
      }
      const nextBtn = page.getByTestId('quiz-next')
      if (await nextBtn.isVisible()) await nextBtn.click()
    }
    await page.getByTestId('home-button').click()
    await expect(page.getByTestId('star-rating')).toBeVisible()
  })
})
