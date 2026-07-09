import { useState } from 'react'
import type { QuizQuestion } from '../data/prepositions'

interface Props {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}

const OPTION_COLORS = ['#8B5CF6', '#0EA5E9', '#F59E0B', '#10B981']

export function QuizGame({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const question = questions[current]
  const isCorrect = selected === question?.correctAnswer
  const isAnswered = selected !== null

  const handleAnswer = (option: string) => {
    if (isAnswered) return
    setSelected(option)
    setAnimKey((k) => k + 1)
  }

  const handleNext = () => {
    const newScore = isCorrect ? score + 1 : score
    if (current + 1 >= questions.length) {
      setShowResult(true)
      onComplete(newScore)
    } else {
      setScore(newScore)
      setCurrent(current + 1)
      setSelected(null)
    }
  }

  if (showResult) {
    const finalScore = isCorrect ? score + 1 : score
    const pct = Math.round((finalScore / questions.length) * 100)
    const msg = pct >= 80 ? ['🏆', 'Amazing! You\'re a superstar!', '#F59E0B']
               : pct >= 50 ? ['⭐', 'Good work! Keep going!', '#8B5CF6']
               : ['💪', 'Keep practicing! You can do it!', '#0EA5E9']

    return (
      <div data-testid="quiz-result" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 12 }}>{msg[0]}</div>
        <div style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 900, fontSize: 52, color: msg[2] as string,
          lineHeight: 1,
        }}>
          {finalScore}<span style={{ fontSize: 28, color: '#9CA3AF' }}>/{questions.length}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#374151', marginTop: 8 }}>{msg[1]}</div>

        {/* Score bar */}
        <div style={{ margin: '20px auto', width: 260, height: 16, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${msg[2]}, ${msg[2]}88)`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>
    )
  }

  const progress = ((current) / questions.length) * 100

  return (
    <div data-testid="quiz-game" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Score: {score} ⭐</span>
        </div>
        <div style={{ height: 10, background: '#E0E7FF', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #8B5CF6, #0EA5E9)',
            borderRadius: 999, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Scene card */}
      <div style={{
        background: 'white', borderRadius: 24,
        boxShadow: '0 6px 28px rgba(0,0,0,0.09)',
        padding: '24px 20px', textAlign: 'center',
        border: '2px solid #F3F4F6',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12 }}>
          Which word fits?
        </div>
        {/* Spatial scene */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
            {question.subjectEmoji}
          </div>
          <div style={{
            background: '#F0F4FF', border: '3px dashed #C7D2FE',
            borderRadius: 12, padding: '6px 32px',
            fontWeight: 900, fontSize: 22, color: '#818CF8', letterSpacing: 4,
          }}>
            ???
          </div>
          <div style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
            {question.containerEmoji}
          </div>
        </div>
        <div style={{
          marginTop: 14, fontWeight: 700, fontSize: 14,
          color: '#6B7280', lineHeight: 1.4,
          background: '#F9FAFB', borderRadius: 12, padding: '8px 16px',
        }}>
          {question.prepositionDesc}
        </div>
      </div>

      {/* Answer options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {question.options.map((option, i) => {
          const isThis = option === selected
          const isRight = option === question.correctAnswer
          let bg = 'white'
          let border = '3px solid #E5E7EB'
          let textColor = '#111827'
          let shadow = '0 2px 8px rgba(0,0,0,0.06)'
          let scale = 'scale(1)'

          if (isAnswered) {
            if (isRight) {
              bg = '#D1FAE5'; border = '3px solid #10B981'; textColor = '#065F46'
              shadow = '0 0 0 4px rgba(16,185,129,0.2)'
            } else if (isThis) {
              bg = '#FEE2E2'; border = '3px solid #EF4444'; textColor = '#991B1B'
            } else {
              textColor = '#9CA3AF'
            }
          } else {
            border = `3px solid ${OPTION_COLORS[i % 4]}33`
          }

          return (
            <button
              key={`${option}-${animKey}`}
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${option}`}
              className={isAnswered && isThis ? (isCorrect ? 'pop' : 'wiggle') : ''}
              style={{
                background: bg, border, borderRadius: 18,
                padding: '16px 8px', cursor: isAnswered ? 'default' : 'pointer',
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 900, fontSize: 26, color: textColor,
                boxShadow: shadow, transition: 'all 0.2s ease',
                transform: scale, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 2,
              }}
            >
              {option}
              {isAnswered && isRight && <span style={{ fontSize: 14, fontWeight: 700 }}>✅</span>}
              {isAnswered && isThis && !isRight && <span style={{ fontSize: 14, fontWeight: 700 }}>❌</span>}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {isAnswered && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: isCorrect ? '#D1FAE5' : '#FEE2E2',
            border: `2px solid ${isCorrect ? '#6EE7B7' : '#FECACA'}`,
            borderRadius: 16, padding: '12px 24px',
            fontWeight: 800, fontSize: 18,
            color: isCorrect ? '#065F46' : '#991B1B',
            textAlign: 'center',
          }}>
            {isCorrect ? '🎉 Perfekt! Excellent!' : `❌ It was "${question.correctAnswer}"`}
          </div>
          <button
            onClick={handleNext}
            data-testid="quiz-next"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #0EA5E9 100%)',
              border: 'none', borderRadius: 999, padding: '14px 40px',
              color: 'white', fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800, fontSize: 18, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(139,92,246,0.4)',
            }}
          >
            {current + 1 >= questions.length ? 'See Results! 🏆' : 'Next Question ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
