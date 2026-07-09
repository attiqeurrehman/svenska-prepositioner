import { test, expect } from '@playwright/test'

test.describe('Quiz Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('nav-quiz').click()
  })

  test('shows first question', async ({ page }) => {
    await expect(page.getByText('Question 1 of 8')).toBeVisible()
  })

  test('selecting correct answer shows green feedback', async ({ page }) => {
    await page.getByTestId('quiz-option-på').click()
    await expect(page.getByText(/Correct/)).toBeVisible()
  })

  test('selecting wrong answer shows red feedback', async ({ page }) => {
    await page.getByTestId('quiz-option-under').click()
    await expect(page.getByText(/It was/)).toBeVisible()
  })

  test('can advance to next question after answering', async ({ page }) => {
    await page.getByTestId('quiz-option-på').click()
    await page.getByTestId('quiz-next').click()
    await expect(page.getByText('Question 2 of 8')).toBeVisible()
  })

  test('shows star rating on home after completing quiz', async ({ page }) => {
    // answer all 8 questions
    const answers = ['på', 'under', 'i', 'över', 'bredvid', 'bakom', 'framför', 'mellan']
    for (const answer of answers) {
      const btn = page.getByTestId(`quiz-option-${answer}`)
      if (await btn.isVisible()) {
        await btn.click()
      } else {
        // pick first option if correct not visible
        await page.locator('[data-testid^="quiz-option-"]').first().click()
      }
      const nextBtn = page.getByTestId('quiz-next')
      if (await nextBtn.isVisible()) await nextBtn.click()
    }
    await page.getByTestId('home-button').click()
    await expect(page.getByTestId('star-rating')).toBeVisible()
  })
})
