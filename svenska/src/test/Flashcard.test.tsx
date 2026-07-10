import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Flashcard } from '../components/Flashcard'
import { PREPOSITIONS } from '../data/prepositions'

const prep = PREPOSITIONS[0] // på
const defaultProps = {
  preposition: prep,
  exampleSwedish: 'Katten är PÅ bordet',
  exampleEnglish: 'The cat is ON the table',
  onNext: vi.fn(),
  onPrev: vi.fn(),
  current: 1,
  total: 8,
}

describe('Flashcard', () => {
  it('renders the flashcard component', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByTestId('flashcard')).toBeInTheDocument()
  })

  it('shows the Swedish word on the front face', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByTestId('flashcard-card')).toHaveTextContent('på')
  })

  it('shows 1/8 counter', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByText('1 / 8')).toBeInTheDocument()
  })

  it('flips to show English meaning on click', () => {
    render(<Flashcard {...defaultProps} />)
    const card = screen.getByTestId('flashcard-card')
    fireEvent.click(card)
    expect(card).toHaveTextContent('ON')
  })

  it('renders prev and next nav buttons', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByTestId('flashcard-next')).toBeInTheDocument()
    expect(screen.getByTestId('flashcard-prev')).toBeInTheDocument()
  })
})
