import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuizGame } from '../components/QuizGame'
import type { QuizQuestion } from '../data/prepositions'

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    sceneDescription: 'Katten sitter på bordet',
    correctAnswer: 'på',
    options: ['på', 'under', 'i', 'bredvid'],
    subjectEmoji: '🐱',
    containerEmoji: '🪑',
    prepositionDesc: 'The cat is ON the table',
  },
  {
    id: 'q2',
    sceneDescription: 'Hunden sover under sängen',
    correctAnswer: 'under',
    options: ['på', 'under', 'bakom', 'över'],
    subjectEmoji: '🐶',
    containerEmoji: '🛏️',
    prepositionDesc: 'The dog is UNDER the bed',
  },
]

describe('QuizGame', () => {
  it('renders the first question', () => {
    render(<QuizGame questions={questions} onComplete={vi.fn()} />)
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByTestId('quiz-option-på')).toBeInTheDocument()
  })

  it('shows correct feedback on right answer', () => {
    render(<QuizGame questions={questions} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('quiz-option-på'))
    expect(screen.getByText(/Correct/)).toBeInTheDocument()
  })

  it('shows wrong feedback on wrong answer', () => {
    render(<QuizGame questions={questions} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('quiz-option-under'))
    expect(screen.getByText(/It was/)).toBeInTheDocument()
  })

  it('advances to next question', () => {
    render(<QuizGame questions={questions} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('quiz-option-på'))
    fireEvent.click(screen.getByTestId('quiz-next'))
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })

  it('calls onComplete with score after last question', () => {
    const onComplete = vi.fn()
    render(<QuizGame questions={questions} onComplete={onComplete} />)
    fireEvent.click(screen.getByTestId('quiz-option-på'))
    fireEvent.click(screen.getByTestId('quiz-next'))
    fireEvent.click(screen.getByTestId('quiz-option-under'))
    fireEvent.click(screen.getByTestId('quiz-next'))
    expect(onComplete).toHaveBeenCalledWith(2)
  })

  it('shows result screen after completion', () => {
    const onComplete = vi.fn()
    render(<QuizGame questions={questions} onComplete={onComplete} />)
    fireEvent.click(screen.getByTestId('quiz-option-på'))
    fireEvent.click(screen.getByTestId('quiz-next'))
    fireEvent.click(screen.getByTestId('quiz-option-under'))
    fireEvent.click(screen.getByTestId('quiz-next'))
    expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
  })
})
