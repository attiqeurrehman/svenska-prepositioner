import { useState } from 'react'
import type { Preposition } from '../data/prepositions'

interface Props {
  preposition: Preposition
  exampleSwedish: string
  exampleEnglish: string
  onNext: () => void
  onPrev: () => void
  current: number
  total: number
}

export function Flashcard({ preposition, exampleSwedish, exampleEnglish, onNext, onPrev, current, total }: Props) {
  const [flipped, setFlipped] = useState(false)

  const handleNext = () => {
    setFlipped(false)
    setTimeout(onNext, 150)
  }

  const handlePrev = () => {
    setFlipped(false)
    setTimeout(onPrev, 150)
  }

  return (
    <div className="flex flex-col items-center gap-6" data-testid="flashcard">
      <div className="text-lg font-bold text-purple-600">
        Card {current} of {total}
      </div>

      {/* Card */}
      <div
        className="relative w-72 h-48 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        data-testid="flashcard-card"
        role="button"
        aria-label={flipped ? 'Flip to Swedish' : 'Flip to see meaning'}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl transition-all duration-300 ${
            flipped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ backgroundColor: preposition.color }}
        >
          <div className="text-7xl">{preposition.emoji}</div>
          <div className="text-5xl font-black text-white drop-shadow-md">{preposition.swedish}</div>
          <div className="text-sm text-white/80 font-semibold">Tap to flip! 👆</div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl bg-white border-4 transition-all duration-300 ${
            flipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ borderColor: preposition.color }}
        >
          <div className="text-4xl font-black" style={{ color: preposition.color }}>
            {preposition.english.toUpperCase()}
          </div>
          <div className="text-center px-4">
            <div className="text-xl font-bold text-gray-700">{exampleSwedish}</div>
            <div className="text-sm text-gray-500 mt-1">{exampleEnglish}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-full text-xl font-bold transition-colors"
          aria-label="Previous card"
          data-testid="flashcard-prev"
        >
          ◀ Prev
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-full text-xl font-bold text-white transition-colors"
          style={{ backgroundColor: preposition.color }}
          aria-label="Next card"
          data-testid="flashcard-next"
        >
          Next ▶
        </button>
      </div>
    </div>
  )
}
