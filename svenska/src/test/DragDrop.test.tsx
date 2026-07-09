import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DragDrop } from '../components/DragDrop'
import type { DragScene } from '../data/prepositions'

const scenes: DragScene[] = [
  {
    id: 'd1',
    instruction: 'Put the cat ON the table',
    instructionSwedish: 'Sätt katten PÅ bordet',
    preposition: 'på',
    subjectEmoji: '🐱',
    targetLabel: 'table',
    targetEmoji: '🪑',
    zones: [
      { id: 'on', label: 'On top', emoji: '🙋', correct: true },
      { id: 'under', label: 'Under', emoji: '🐢', correct: false },
      { id: 'beside', label: 'Beside', emoji: '🤝', correct: false },
    ],
  },
  {
    id: 'd2',
    instruction: 'Put the dog UNDER the bed',
    instructionSwedish: 'Sätt hunden UNDER sängen',
    preposition: 'under',
    subjectEmoji: '🐶',
    targetLabel: 'bed',
    targetEmoji: '🛏️',
    zones: [
      { id: 'on', label: 'On top', emoji: '🙋', correct: false },
      { id: 'under', label: 'Under', emoji: '🐢', correct: true },
      { id: 'beside', label: 'Beside', emoji: '🤝', correct: false },
    ],
  },
]

describe('DragDrop', () => {
  it('renders scene instruction', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    expect(screen.getByText('Put the cat ON the table')).toBeInTheDocument()
  })

  it('shows the subject emoji', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    expect(screen.getByTestId('drag-subject')).toBeInTheDocument()
  })

  it('renders all drop zones', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    expect(screen.getByTestId('drop-zone-on')).toBeInTheDocument()
    expect(screen.getByTestId('drop-zone-under')).toBeInTheDocument()
    expect(screen.getByTestId('drop-zone-beside')).toBeInTheDocument()
  })

  it('shows positive feedback when correct zone tapped', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('drop-zone-on'))
    expect(screen.getByText(/Perfekt/)).toBeInTheDocument()
  })

  it('shows error feedback when wrong zone tapped', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('drop-zone-under'))
    expect(screen.getByText(/på/)).toBeInTheDocument()
  })

  it('advances to next scene', () => {
    render(<DragDrop scenes={scenes} onComplete={vi.fn()} />)
    fireEvent.click(screen.getByTestId('drop-zone-on'))
    fireEvent.click(screen.getByTestId('drag-next'))
    expect(screen.getByText('Scene 2 of 2')).toBeInTheDocument()
  })

  it('calls onComplete after all scenes', () => {
    const onComplete = vi.fn()
    render(<DragDrop scenes={scenes} onComplete={onComplete} />)
    fireEvent.click(screen.getByTestId('drop-zone-on'))
    fireEvent.click(screen.getByTestId('drag-next'))
    fireEvent.click(screen.getByTestId('drop-zone-under'))
    fireEvent.click(screen.getByTestId('drag-next'))
    expect(onComplete).toHaveBeenCalledWith(2)
  })
})
