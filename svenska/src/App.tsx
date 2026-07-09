import { useState } from 'react'
import { Flashcard } from './components/Flashcard'
import { QuizGame } from './components/QuizGame'
import { DragDrop } from './components/DragDrop'
import { PREPOSITIONS, QUIZ_QUESTIONS, DRAG_SCENES } from './data/prepositions'

type Mode = 'home' | 'flashcards' | 'quiz' | 'drag'

const FLASHCARD_EXAMPLES: { swedish: string; english: string }[] = [
  { swedish: 'Katten är PÅ bordet', english: 'The cat is ON the table' },
  { swedish: 'Hunden sover UNDER sängen', english: 'The dog sleeps UNDER the bed' },
  { swedish: 'Äpplet är I korgen', english: 'The apple is IN the basket' },
  { swedish: 'Boken är BAKOM TV:n', english: 'The book is BEHIND the TV' },
  { swedish: 'Barnet står FRAMFÖR dörren', english: 'The child stands IN FRONT OF the door' },
  { swedish: 'Stolen är BREDVID soffan', english: 'The chair is NEXT TO the sofa' },
  { swedish: 'Fågeln flyger ÖVER huset', english: 'The bird flies ABOVE the house' },
  { swedish: 'Blomman är MELLAN fönstren', english: 'The flower is BETWEEN the windows' },
]

function StarRating({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? score / total : 0
  const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1
  return (
    <span data-testid="star-rating">
      {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
    </span>
  )
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 p-4">
      <header className="text-center py-4">
        <h1 className="text-4xl font-black text-purple-700 drop-shadow-sm">
          🇸🇪 Svenska Prepositioner
        </h1>
        <p className="text-lg text-gray-500 font-semibold mt-1">Learn Swedish prepositions! 🎉</p>
      </header>

      {mode !== 'home' && (
        <button
          onClick={goHome}
          className="mb-4 px-4 py-2 bg-white rounded-full shadow text-purple-700 font-bold hover:bg-purple-50 transition-colors"
          data-testid="home-button"
        >
          ← Home
        </button>
      )}

      {mode === 'home' && (
        <main className="flex flex-col items-center gap-6 py-6" data-testid="home">
          <div className="text-6xl animate-bounce">🦁</div>
          <p className="text-xl font-bold text-gray-600 text-center max-w-xs">
            Where is the lion? Let&apos;s learn Swedish words for places!
          </p>

          <div className="grid gap-4 w-full max-w-xs">
            <ActivityCard
              emoji="📚"
              title="Flashcards"
              subtitle="Learn new words"
              color="#DDA0DD"
              onClick={() => setMode('flashcards')}
              testId="nav-flashcards"
            />
            <ActivityCard
              emoji="🧠"
              title="Quiz Game"
              subtitle="Test yourself!"
              color="#45B7D1"
              onClick={() => setMode('quiz')}
              testId="nav-quiz"
              score={scores.quiz !== undefined ? <StarRating score={scores.quiz} total={QUIZ_QUESTIONS.length} /> : null}
            />
            <ActivityCard
              emoji="🎯"
              title="Drag & Drop"
              subtitle="Move the animals!"
              color="#96CEB4"
              onClick={() => setMode('drag')}
              testId="nav-drag"
              score={scores.drag !== undefined ? <StarRating score={scores.drag} total={DRAG_SCENES.length} /> : null}
            />
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-md w-full max-w-xs mt-2">
            <div className="text-lg font-black text-gray-700 mb-3 text-center">All Prepositions</div>
            <div className="grid grid-cols-2 gap-2">
              {PREPOSITIONS.map((p) => (
                <div
                  key={p.swedish}
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ backgroundColor: p.color + '33' }}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <div className="font-black text-sm" style={{ color: p.color }}>
                      {p.swedish}
                    </div>
                    <div className="text-xs text-gray-500">{p.english}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {mode === 'flashcards' && (
        <section className="flex flex-col items-center py-4" data-testid="flashcards-section">
          <h2 className="text-2xl font-black text-purple-700 mb-6">📚 Flashcards</h2>
          <Flashcard
            preposition={PREPOSITIONS[cardIndex]}
            exampleSwedish={FLASHCARD_EXAMPLES[cardIndex].swedish}
            exampleEnglish={FLASHCARD_EXAMPLES[cardIndex].english}
            onNext={() => setCardIndex((i) => Math.min(i + 1, PREPOSITIONS.length - 1))}
            onPrev={() => setCardIndex((i) => Math.max(i - 1, 0))}
            current={cardIndex + 1}
            total={PREPOSITIONS.length}
          />
        </section>
      )}

      {mode === 'quiz' && (
        <section className="flex flex-col items-center py-4" data-testid="quiz-section">
          <h2 className="text-2xl font-black text-blue-700 mb-6">🧠 Quiz Game</h2>
          <QuizGame
            key={quizDone ? 'done' : 'playing'}
            questions={QUIZ_QUESTIONS}
            onComplete={(s) => {
              setScores((prev) => ({ ...prev, quiz: s }))
              setQuizDone(true)
            }}
          />
          {quizDone && (
            <button
              onClick={() => { setQuizDone(false) }}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full text-xl font-bold hover:bg-blue-700"
              data-testid="quiz-restart"
            >
              Play Again 🔄
            </button>
          )}
        </section>
      )}

      {mode === 'drag' && (
        <section className="flex flex-col items-center py-4" data-testid="drag-section">
          <h2 className="text-2xl font-black text-green-700 mb-6">🎯 Drag & Drop</h2>
          <DragDrop
            key={dragDone ? 'done' : 'playing'}
            scenes={DRAG_SCENES}
            onComplete={(s) => {
              setScores((prev) => ({ ...prev, drag: s }))
              setDragDone(true)
            }}
          />
          {dragDone && (
            <button
              onClick={() => { setDragDone(false) }}
              className="mt-6 px-8 py-3 bg-green-600 text-white rounded-full text-xl font-bold hover:bg-green-700"
              data-testid="drag-restart"
            >
              Play Again 🔄
            </button>
          )}
        </section>
      )}
    </div>
  )
}

function ActivityCard({
  emoji, title, subtitle, color, onClick, testId, score,
}: {
  emoji: string
  title: string
  subtitle: string
  color: string
  onClick: () => void
  testId: string
  score?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="flex items-center gap-4 p-4 rounded-2xl shadow-md hover:scale-105 transition-transform text-left w-full"
      style={{ backgroundColor: color + '44', borderLeft: `6px solid ${color}` }}
    >
      <span className="text-5xl">{emoji}</span>
      <div className="flex-1">
        <div className="text-xl font-black text-gray-800">{title}</div>
        <div className="text-sm text-gray-500 font-semibold">{subtitle}</div>
      </div>
      {score && <div className="text-lg">{score}</div>}
    </button>
  )
}
