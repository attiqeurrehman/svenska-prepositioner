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

const CARD_GRADIENTS: Record<string, string> = {
  'på':      'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
  'under':   'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
  'i':       'linear-gradient(135deg, #34D399 0%, #059669 100%)',
  'bakom':   'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
  'framför': 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
  'bredvid': 'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)',
  'över':    'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
  'mellan':  'linear-gradient(135deg, #86EFAC 0%, #16A34A 100%)',
}

const CARD_SHADOWS: Record<string, string> = {
  'på':      'rgba(220,38,38,0.4)',
  'under':   'rgba(37,99,235,0.4)',
  'i':       'rgba(5,150,105,0.4)',
  'bakom':   'rgba(124,58,237,0.4)',
  'framför': 'rgba(217,119,6,0.4)',
  'bredvid': 'rgba(219,39,119,0.4)',
  'över':    'rgba(2,132,199,0.4)',
  'mellan':  'rgba(22,163,74,0.4)',
}

const DOTS = ['on', 'under', 'in', 'behind', 'front', 'beside', 'above', 'between']

export function Flashcard({ preposition, exampleSwedish, exampleEnglish, onNext, onPrev, current, total }: Props) {
  const [flipped, setFlipped] = useState(false)

  const gradient = CARD_GRADIENTS[preposition.swedish] ?? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
  const shadow = CARD_SHADOWS[preposition.swedish] ?? 'rgba(0,0,0,0.3)'

  const handleNext = () => { setFlipped(false); setTimeout(onNext, 200) }
  const handlePrev = () => { setFlipped(false); setTimeout(onPrev, 200) }

  return (
    <div data-testid="flashcard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {DOTS.map((_, i) => (
          <div key={i} style={{
            width: i === current - 1 ? 24 : 8,
            height: 8, borderRadius: 999,
            background: i === current - 1 ? '#6D28D9' : '#DDD6FE',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Flip card */}
      <div
        className="flip-container"
        style={{ width: '100%', height: 280, cursor: 'pointer' }}
        onClick={() => setFlipped((f) => !f)}
        data-testid="flashcard-card"
        role="button"
        aria-label={flipped ? 'Flip back to Swedish' : 'Tap to see meaning'}
      >
        <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
          {/* FRONT — Swedish word */}
          <div className="flip-front" style={{
            background: gradient,
            boxShadow: `0 12px 40px ${shadow}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -10, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

            <div style={{
              fontSize: 72, lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            }}>
              {preposition.emoji}
            </div>
            <div style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 900, fontSize: 56, color: 'white', lineHeight: 1,
              textShadow: '0 3px 12px rgba(0,0,0,0.2)',
            }}>
              {preposition.swedish}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.25)', borderRadius: 999,
              padding: '6px 18px', color: 'white', fontWeight: 700, fontSize: 13,
            }}>
              Tryck för att vända / Tap to flip 👆
            </div>
          </div>

          {/* BACK — English meaning */}
          <div className="flip-back" style={{
            background: 'white',
            border: '4px solid',
            borderColor: gradient.includes('#DC2626') ? '#DC2626' : gradient.includes('#2563EB') ? '#2563EB' : '#6D28D9',
            boxShadow: `0 12px 40px ${shadow}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
            padding: '0 28px',
          }}>
            <div style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 900, fontSize: 13, letterSpacing: 2,
              color: '#9CA3AF', textTransform: 'uppercase',
            }}>
              🇬🇧 På engelska / In English
            </div>
            <div style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 900, fontSize: 42, lineHeight: 1,
              background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {preposition.english.toUpperCase()}
            </div>
            <div style={{
              background: '#F9FAFB', borderRadius: 16, padding: '12px 20px',
              textAlign: 'center', width: '100%',
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', lineHeight: 1.4 }}>
                {exampleSwedish}
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                {exampleEnglish}
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#9CA3AF' }}>Tryck för att vända / Tap to flip back 🔄</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={handlePrev}
          data-testid="flashcard-prev"
          disabled={current === 1}
          style={{
            width: 52, height: 52, borderRadius: '50%', border: 'none',
            background: current === 1 ? '#F3F4F6' : 'white',
            boxShadow: current === 1 ? 'none' : '0 4px 12px rgba(0,0,0,0.12)',
            fontSize: 20, cursor: current === 1 ? 'not-allowed' : 'pointer',
            opacity: current === 1 ? 0.4 : 1,
          }}
          aria-label="Previous card"
        >
          ◀
        </button>

        <div style={{
          background: 'white', borderRadius: 999, padding: '8px 20px',
          fontWeight: 800, fontSize: 14, color: '#374151',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {current} / {total}
        </div>

        <button
          onClick={handleNext}
          data-testid="flashcard-next"
          disabled={current === total}
          style={{
            width: 52, height: 52, borderRadius: '50%', border: 'none',
            background: current === total ? '#F3F4F6' : gradient,
            boxShadow: current === total ? 'none' : `0 4px 16px ${shadow}`,
            fontSize: 20, cursor: current === total ? 'not-allowed' : 'pointer',
            opacity: current === total ? 0.4 : 1,
          }}
          aria-label="Next card"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
