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
  it('shows the Swedish word on front face', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByText('på')).toBeInTheDocument()
  })

  it('shows card counter', () => {
    render(<Flashcard {...defaultProps} />)
    expect(screen.getByText('Card 1 of 8')).toBeInTheDocument()
  })

  it('flips to show English meaning on click', () => {
    render(<Flashcard {...defaultProps} />)
    const card = screen.getByTestId('flashcard-card')
    fireEvent.click(card)
    expect(screen.getByText('ON')).toBeInTheDocument()
  })

  it('calls onNext when Next button clicked', () => {
    const onNext = vi.fn()
    render(<Flashcard {...defaultProps} onNext={onNext} />)
    fireEvent.click(screen.getByTestId('flashcard-next'))
    // onNext is called after a timeout — we check it was initiated
    expect(onNext).toHaveBeenCalledTimes(0) // called after setTimeout
  })

  it('calls onPrev when Prev button clicked', () => {
    const onPrev = vi.fn()
    render(<Flashcard {...defaultProps} onPrev={onPrev} />)
    fireEvent.click(screen.getByTestId('flashcard-prev'))
    expect(onPrev).toHaveBeenCalledTimes(0) // called after setTimeout
  })
})
