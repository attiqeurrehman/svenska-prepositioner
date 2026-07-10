import { useState } from 'react'
import { Flashcard } from './components/Flashcard'
import { QuizGame } from './components/QuizGame'
import { DragDrop } from './components/DragDrop'
import { PREPOSITIONS, QUIZ_QUESTIONS, DRAG_SCENES } from './data/prepositions'

type Mode = 'home' | 'flashcards' | 'quiz' | 'drag'

const FLASHCARD_EXAMPLES = [
  { swedish: 'Katten är PÅ bordet', english: 'The cat is ON the table' },
  { swedish: 'Hunden sover UNDER sängen', english: 'The dog sleeps UNDER the bed' },
  { swedish: 'Äpplet är I korgen', english: 'The apple is IN the basket' },
  { swedish: 'Boken är BAKOM TV:n', english: 'The book is BEHIND the TV' },
  { swedish: 'Barnet står FRAMFÖR dörren', english: 'The child stands IN FRONT OF the door' },
  { swedish: 'Stolen är BREDVID soffan', english: 'The chair is NEXT TO the sofa' },
  { swedish: 'Fågeln flyger ÖVER huset', english: 'The bird flies ABOVE the house' },
  { swedish: 'Blomman är MELLAN fönstren', english: 'The flower is BETWEEN the windows' },
]

// Custom SVG icons for activity cards
function FlashcardIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <rect x="8" y="16" width="48" height="34" rx="6" fill="white" fillOpacity="0.3"/>
      <rect x="4" y="12" width="48" height="34" rx="6" fill="white" fillOpacity="0.5"/>
      <rect x="8" y="8" width="48" height="34" rx="6" fill="white"/>
      <text x="32" y="29" textAnchor="middle" fontSize="16" fontWeight="900" fill="#8B5CF6" fontFamily="'Baloo 2', sans-serif">Å</text>
      <line x1="16" y1="34" x2="48" y2="34" stroke="#E0D0FF" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="38" x2="36" y2="38" stroke="#E0D0FF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <circle cx="32" cy="32" r="24" fill="white" fillOpacity="0.9"/>
      <text x="32" y="40" textAnchor="middle" fontSize="26" fontWeight="900" fill="#0EA5E9" fontFamily="'Baloo 2', sans-serif">?</text>
      <circle cx="48" cy="16" r="8" fill="#FCD34D"/>
      <text x="48" y="20" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="'Baloo 2', sans-serif">!</text>
    </svg>
  )
}

function DragIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <rect x="6" y="28" width="28" height="28" rx="8" fill="white" fillOpacity="0.9"/>
      <text x="20" y="48" textAnchor="middle" fontSize="20" fontFamily="sans-serif">🐱</text>
      <path d="M38 32 L52 32 M46 26 L52 32 L46 38" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="34" y="6" width="24" height="18" rx="6" fill="white" fillOpacity="0.6" strokeDasharray="3 3" stroke="white" strokeWidth="2"/>
      <text x="46" y="19" textAnchor="middle" fontSize="10" fill="white" fontFamily="'Baloo 2', sans-serif" fontWeight="700">PÅ</text>
    </svg>
  )
}

const PREP_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  'på':      { bg: '#FEE2E2', text: '#DC2626', ring: '#FECACA' },
  'under':   { bg: '#DBEAFE', text: '#2563EB', ring: '#BFDBFE' },
  'i':       { bg: '#D1FAE5', text: '#059669', ring: '#A7F3D0' },
  'bakom':   { bg: '#EDE9FE', text: '#7C3AED', ring: '#DDD6FE' },
  'framför': { bg: '#FEF3C7', text: '#D97706', ring: '#FDE68A' },
  'bredvid': { bg: '#FCE7F3', text: '#DB2777', ring: '#FBCFE8' },
  'över':    { bg: '#E0F2FE', text: '#0284C7', ring: '#BAE6FD' },
  'mellan':  { bg: '#ECFCCB', text: '#65A30D', ring: '#D9F99D' },
}

function StarRating({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0
  const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1
  return <span data-testid="star-rating">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
}

export default function App() {
  const [mode, setMode] = useState<Mode>('home')
  const [cardIndex, setCardIndex] = useState(0)
  const [scores, setScores] = useState<{ quiz?: number; drag?: number }>({})
  const [quizDone, setQuizDone] = useState(false)
  const [dragDone, setDragDone] = useState(false)

  const goHome = () => {
    setMode('home')
    setQuizDone(false)
    setDragDone(false)
    setCardIndex(0)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFF8EE 0%, #F0F4FF 100%)' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #06B6D4 100%)',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: 10, left: '40%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', padding: '20px 20px 18px', textAlign: 'center' }}>
          {mode !== 'home' ? (
            <button onClick={goHome} data-testid="home-button" style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: 999, padding: '6px 14px', color: 'white',
              fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 15,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              ← Home
            </button>
          ) : null}

          <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 4 }}>🇸🇪</div>
          <h1 style={{
            margin: 0, color: 'white',
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 900, fontSize: 28, letterSpacing: '-0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            Svenska Prepositioner
          </h1>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 14 }}>
            Learn Swedish words for places! ✨
          </p>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 390 24" style={{ display: 'block', marginBottom: -1 }} xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 Q97 24 195 12 Q292 0 390 18 L390 24 L0 24 Z" fill="#FFF8EE"/>
        </svg>
      </header>

      <main style={{ maxWidth: 420, margin: '0 auto', padding: '12px 16px 40px' }}>

        {/* ─── HOME ─── */}
        {mode === 'home' && (
          <div data-testid="home">
            {/* Mascot */}
            <div style={{ textAlign: 'center', margin: '16px 0 20px' }}>
              <div className="float" style={{ fontSize: 72, lineHeight: 1, display: 'inline-block' }}>🦁</div>
              <p style={{
                margin: '10px auto 0', maxWidth: 260,
                fontWeight: 700, fontSize: 17, color: '#374151', lineHeight: 1.4,
              }}>
                Where is the lion? Let&apos;s find out in Swedish! 🎉
              </p>
            </div>

            {/* Activity cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ActivityTile
                gradient="linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
                shadowColor="rgba(109,40,217,0.35)"
                icon={<FlashcardIcon />}
                title="Flashcards"
                subtitle="Learn all 8 words"
                badge={null}
                testId="nav-flashcards"
                onClick={() => setMode('flashcards')}
              />
              <ActivityTile
                gradient="linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)"
                shadowColor="rgba(2,132,199,0.35)"
                icon={<QuizIcon />}
                title="Quiz Game"
                subtitle="Test what you know!"
                badge={scores.quiz !== undefined ? <StarRating score={scores.quiz} total={QUIZ_QUESTIONS.length} /> : null}
                testId="nav-quiz"
                onClick={() => setMode('quiz')}
              />
              <ActivityTile
                gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                shadowColor="rgba(5,150,105,0.35)"
                icon={<DragIcon />}
                title="Drag & Drop"
                subtitle="Move the animals!"
                badge={scores.drag !== undefined ? <StarRating score={scores.drag} total={DRAG_SCENES.length} /> : null}
                testId="nav-drag"
                onClick={() => setMode('drag')}
              />
            </div>

            {/* Prepositions grid */}
            <div style={{
              marginTop: 28, background: 'white',
              borderRadius: 24, padding: '20px 16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            }}>
              <div style={{
                textAlign: 'center', fontWeight: 800, fontSize: 16,
                color: '#111827', marginBottom: 14, letterSpacing: '-0.2px',
              }}>
                📖 All Prepositions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PREPOSITIONS.map((p) => {
                  const c = PREP_COLORS[p.swedish] ?? { bg: '#F3F4F6', text: '#374151', ring: '#E5E7EB' }
                  return (
                    <div key={p.swedish} style={{
                      background: c.bg,
                      border: `2px solid ${c.ring}`,
                      borderRadius: 14, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: c.text, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18, flexShrink: 0,
                      }}>
                        {p.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 16, color: c.text, lineHeight: 1.1 }}>{p.swedish}</div>
                        <div style={{ fontWeight: 600, fontSize: 11, color: '#6B7280', marginTop: 1 }}>{p.english}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── FLASHCARDS ─── */}
        {mode === 'flashcards' && (
          <div data-testid="flashcards-section" style={{ paddingTop: 16 }}>
            <Flashcard
              preposition={PREPOSITIONS[cardIndex]}
              exampleSwedish={FLASHCARD_EXAMPLES[cardIndex].swedish}
              exampleEnglish={FLASHCARD_EXAMPLES[cardIndex].english}
              onNext={() => setCardIndex((i) => Math.min(i + 1, PREPOSITIONS.length - 1))}
              onPrev={() => setCardIndex((i) => Math.max(i - 1, 0))}
              current={cardIndex + 1}
              total={PREPOSITIONS.length}
            />
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {mode === 'quiz' && (
          <div data-testid="quiz-section" style={{ paddingTop: 16 }}>
            <QuizGame
              key={quizDone ? 'done' : 'playing'}
              questions={QUIZ_QUESTIONS}
              onComplete={(s) => {
                setScores((prev) => ({ ...prev, quiz: s }))
                setQuizDone(true)
              }}
            />
            {quizDone && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button onClick={() => setQuizDone(false)} data-testid="quiz-restart" style={restartBtnStyle('#0EA5E9')}>
                  Play Again 🔄
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── DRAG & DROP ─── */}
        {mode === 'drag' && (
          <div data-testid="drag-section" style={{ paddingTop: 16 }}>
            <DragDrop
              key={dragDone ? 'done' : 'playing'}
              scenes={DRAG_SCENES}
              onComplete={(s) => {
                setScores((prev) => ({ ...prev, drag: s }))
                setDragDone(true)
              }}
            />
            {dragDone && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button onClick={() => setDragDone(false)} data-testid="drag-restart" style={restartBtnStyle('#10B981')}>
                  Play Again 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

const restartBtnStyle = (color: string): React.CSSProperties => ({
  background: color, color: 'white', border: 'none', borderRadius: 999,
  padding: '14px 36px', fontSize: 18, fontWeight: 800,
  fontFamily: "'Baloo 2', sans-serif", cursor: 'pointer',
  boxShadow: `0 6px 20px ${color}66`,
})

function ActivityTile({ gradient, shadowColor, icon, title, subtitle, badge, testId, onClick }: {
  gradient: string
  shadowColor: string
  icon: React.ReactNode
  title: string
  subtitle: string
  badge: React.ReactNode
  testId: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="card-press"
      style={{
        background: gradient,
        border: 'none',
        borderRadius: 22,
        padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        boxShadow: `0 8px 24px ${shadowColor}, 0 2px 8px rgba(0,0,0,0.1)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)',
      }} />
      <div style={{
        background: 'rgba(255,255,255,0.22)',
        borderRadius: 16, padding: 10, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 900, fontSize: 22, color: 'white',
          lineHeight: 1.1, textShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}>
          {title}
        </div>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
      {badge && (
        <div style={{ fontSize: 20, flexShrink: 0 }}>{badge}</div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22, flexShrink: 0 }}>›</div>
    </button>
  )
}
