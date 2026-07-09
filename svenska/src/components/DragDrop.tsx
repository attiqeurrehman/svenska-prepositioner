import { useState } from 'react'
import type { DragScene } from '../data/prepositions'

interface Props {
  scenes: DragScene[]
  onComplete: (score: number) => void
}

export function DragDrop({ scenes, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scene = scenes[current]

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'subject')
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()
    setDragOver(null)
    const zone = scene.zones.find((z) => z.id === zoneId)
    if (!zone) return
    setResult(zone.correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    const newScore = result === 'correct' ? score + 1 : score
    if (current + 1 >= scenes.length) {
      setDone(true)
      onComplete(newScore)
    } else {
      setScore(newScore)
      setCurrent(current + 1)
      setResult(null)
    }
  }

  // Touch-based tap selection for kids on tablets
  const [tapped, setTapped] = useState<string | null>(null)

  const handleZoneTap = (zoneId: string) => {
    if (result) return
    setTapped(zoneId)
    const zone = scene.zones.find((z) => z.id === zoneId)
    if (!zone) return
    setResult(zone.correct ? 'correct' : 'wrong')
  }

  if (done) {
    const finalScore = result === 'correct' ? score + 1 : score
    const pct = Math.round((finalScore / scenes.length) * 100)
    return (
      <div className="flex flex-col items-center gap-6 py-8" data-testid="drag-result">
        <div className="text-8xl">{pct >= 80 ? '🏆' : '⭐'}</div>
        <div className="text-4xl font-black text-purple-700">
          {finalScore} / {scenes.length}
        </div>
        <div className="text-2xl font-bold text-gray-600">
          {pct >= 80 ? 'Superstar! 🌟' : 'Great effort! 💪'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5" data-testid="drag-drop">
      <div className="text-sm font-bold text-blue-500">
        Scene {current + 1} of {scenes.length}
      </div>

      {/* Instruction */}
      <div className="bg-blue-100 rounded-2xl px-6 py-3 text-center">
        <div className="text-xl font-black text-blue-800">{scene.instruction}</div>
        <div className="text-lg font-bold text-blue-600">{scene.instructionSwedish}</div>
      </div>

      {/* Draggable subject */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-bold text-gray-500">Drag or tap below:</div>
        <div
          draggable
          onDragStart={handleDragStart}
          className="text-8xl cursor-grab active:cursor-grabbing select-none"
          data-testid="drag-subject"
        >
          {scene.subjectEmoji}
        </div>
      </div>

      {/* Drop zones */}
      <div className="flex gap-4 flex-wrap justify-center">
        {scene.zones.map((zone) => {
          let borderColor = 'border-gray-300'
          let bg = 'bg-white'
          if (dragOver === zone.id) {
            borderColor = 'border-blue-500'
            bg = 'bg-blue-50'
          }
          if (result) {
            if (zone.correct) {
              borderColor = 'border-green-500'
              bg = 'bg-green-50'
            } else if (tapped === zone.id && !zone.correct) {
              borderColor = 'border-red-500'
              bg = 'bg-red-50'
            }
          }

          return (
            <div
              key={zone.id}
              data-testid={`drop-zone-${zone.id}`}
              onClick={() => handleZoneTap(zone.id)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(zone.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, zone.id)}
              className={`w-28 h-28 rounded-2xl border-4 ${borderColor} ${bg} flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 select-none`}
            >
              <div className="text-4xl">{zone.emoji}</div>
              <div className="text-xs font-bold text-gray-600">{zone.label}</div>
              {result && zone.correct && <div className="text-xl">✅</div>}
            </div>
          )
        })}
      </div>

      {/* Target */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-5xl">{scene.targetEmoji}</div>
        <div className="text-sm font-bold text-gray-500">{scene.targetLabel}</div>
      </div>

      {/* Feedback */}
      {result && (
        <div className="flex flex-col items-center gap-3">
          <div className={`text-2xl font-bold ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {result === 'correct' ? '🎉 Perfekt!' : `❌ Try again! "${scene.preposition}" = ${scene.instruction.split(' ').slice(2).join(' ')}`}
          </div>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-full text-xl font-bold hover:bg-blue-700 transition-colors"
            data-testid="drag-next"
          >
            {current + 1 >= scenes.length ? 'Finish! 🏆' : 'Next Scene ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
