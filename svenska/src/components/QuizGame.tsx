import { useState } from 'react'
import type { QuizQuestion } from '../data/prepositions'

interface Props {
  questions: QuizQuestion[]
  onComplete: (score: number) => void
}

export function QuizGame({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const question = questions[current]
  const isCorrect = selected === question?.correctAnswer
  const isAnswered = selected !== null

  const handleAnswer = (option: string) => {
    if (isAnswered) return
    setSelected(option)
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
    return (
      <div className="flex flex-col items-center gap-6 py-8" data-testid="quiz-result">
        <div className="text-8xl">{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
        <div className="text-4xl font-black text-purple-700">
          {finalScore} / {questions.length}
        </div>
        <div className="text-2xl font-bold text-gray-600">
          {pct >= 80 ? 'Amazing job!' : pct >= 50 ? 'Good work!' : 'Keep practicing!'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6" data-testid="quiz-game">
      <div className="text-sm font-bold text-purple-500">
        Question {current + 1} of {questions.length}
      </div>

      {/* Scene */}
      <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="text-7xl">{question.subjectEmoji}</div>
        <div className="text-gray-400 text-2xl font-bold">___</div>
        <div className="text-7xl">{question.containerEmoji}</div>
        <div className="text-base text-gray-500 font-semibold text-center">{question.prepositionDesc}</div>
      </div>

      {/* Question */}
      <div className="text-xl font-bold text-gray-700 text-center">
        Which Swedish word fits?
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {question.options.map((option) => {
          let style = 'bg-white border-4 border-gray-200 hover:border-purple-400'
          if (isAnswered) {
            if (option === question.correctAnswer) {
              style = 'bg-green-100 border-4 border-green-500'
            } else if (option === selected) {
              style = 'bg-red-100 border-4 border-red-500'
            } else {
              style = 'bg-white border-4 border-gray-200 opacity-60'
            }
          }
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              data-testid={`quiz-option-${option}`}
              className={`py-4 rounded-2xl text-2xl font-black transition-all ${style}`}
            >
              {option}
              {isAnswered && option === question.correctAnswer && ' ✅'}
              {isAnswered && option === selected && option !== question.correctAnswer && ' ❌'}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {isAnswered && (
        <div className="flex flex-col items-center gap-3">
          <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 Correct!' : `❌ It was "${question.correctAnswer}"`}
          </div>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-purple-600 text-white rounded-full text-xl font-bold hover:bg-purple-700 transition-colors"
            data-testid="quiz-next"
          >
            {current + 1 >= questions.length ? 'See Results! 🏆' : 'Next ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
