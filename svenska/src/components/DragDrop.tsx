import { useState } from 'react'
import type { DragScene } from '../data/prepositions'

interface Props {
  scenes: DragScene[]
  onComplete: (score: number) => void
}

const ZONE_STYLES = [
  { border: '#8B5CF6', bg: '#F5F3FF', icon: '#8B5CF6' },
  { border: '#0EA5E9', bg: '#F0F9FF', icon: '#0EA5E9' },
  { border: '#10B981', bg: '#F0FDF4', icon: '#10B981' },
]

export function DragDrop({ scenes, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [tapped, setTapped] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scene = scenes[current]

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'subject')
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()
    setDragOver(null)
    selectZone(zoneId)
  }

  const selectZone = (zoneId: string) => {
    if (result) return
    setTapped(zoneId)
    const zone = scene.zones.find((z) => z.id === zoneId)
    setResult(zone?.correct ? 'correct' : 'wrong')
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
      setTapped(null)
    }
  }

  if (done) {
    const finalScore = result === 'correct' ? score + 1 : score
    const pct = Math.round((finalScore / scenes.length) * 100)
    return (
      <div data-testid="drag-result" style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 12 }}>{pct >= 80 ? '🏆' : '⭐'}</div>
        <div style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 900, fontSize: 52, color: '#10B981', lineHeight: 1,
        }}>
          {finalScore}<span style={{ fontSize: 28, color: '#9CA3AF' }}>/{scenes.length}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#374151', marginTop: 8 }}>
          {pct >= 80 ? 'Superstar! 🌟' : 'Great effort! Keep going! 💪'}
        </div>
      </div>
    )
  }

  const progress = (current / scenes.length) * 100

  return (
    <div data-testid="drag-drop" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Scene {current + 1} of {scenes.length}</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Score: {score} ⭐</span>
        </div>
        <div style={{ height: 10, background: '#D1FAE5', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #10B981, #06B6D4)',
            borderRadius: 999, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Instruction banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: 20, padding: '16px 20px', textAlign: 'center',
        boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 900, fontSize: 22, color: 'white', lineHeight: 1.2,
          textShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}>
          {scene.instruction}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
          {scene.instructionSwedish}
        </div>
      </div>

      {/* Main scene */}
      <div style={{
        background: 'white', borderRadius: 24,
        boxShadow: '0 6px 28px rgba(0,0,0,0.08)',
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        {/* Draggable subject */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 8 }}>
            Tap or drag me!
          </div>
          <div
            draggable
            onDragStart={handleDragStart}
            data-testid="drag-subject"
            style={{
              fontSize: 80, lineHeight: 1, cursor: 'grab',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
              display: 'inline-block',
              transition: 'transform 0.2s',
            }}
          >
            {scene.subjectEmoji}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 28, color: '#CBD5E1' }}>↓</div>

        {/* Drop zones */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%' }}>
          {scene.zones.map((zone, i) => {
            const style = ZONE_STYLES[i % 3]
            let borderColor = style.border
            let bg = style.bg
            let extraShadow = 'none'
            let showEmoji = ''

            if (result) {
              if (zone.correct) {
                borderColor = '#10B981'; bg = '#D1FAE5'
                extraShadow = '0 0 0 4px rgba(16,185,129,0.25)'
                showEmoji = '✅'
              } else if (tapped === zone.id) {
                borderColor = '#EF4444'; bg = '#FEE2E2'
                extraShadow = '0 0 0 4px rgba(239,68,68,0.2)'
                showEmoji = '❌'
              }
            }

            return (
              <div
                key={zone.id}
                data-testid={`drop-zone-${zone.id}`}
                onClick={() => selectZone(zone.id)}
                onDragOver={(e) => { e.preventDefault(); setDragOver(zone.id) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, zone.id)}
                className={dragOver === zone.id && !result ? 'zone-hover' : ''}
                style={{
                  flex: 1, minWidth: 0,
                  border: `3px solid ${dragOver === zone.id && !result ? '#6366F1' : borderColor}`,
                  background: dragOver === zone.id && !result ? '#EEF2FF' : bg,
                  borderRadius: 18,
                  padding: '14px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: result ? 'default' : 'pointer',
                  boxShadow: extraShadow,
                  transition: 'all 0.2s ease',
                  transform: dragOver === zone.id && !result ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: 32 }}>{zone.emoji}</div>
                <div style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800, fontSize: 11, color: borderColor, textAlign: 'center', lineHeight: 1.2,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  {zone.label}
                </div>
                {showEmoji && <div style={{ fontSize: 20 }}>{showEmoji}</div>}
              </div>
            )
          })}
        </div>

        {/* Target */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 70, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
            {scene.targetEmoji}
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
            {scene.targetLabel}
          </div>
        </div>
      </div>

      {/* Feedback + Next */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: result === 'correct' ? '#D1FAE5' : '#FEE2E2',
            border: `2px solid ${result === 'correct' ? '#6EE7B7' : '#FECACA'}`,
            borderRadius: 16, padding: '12px 24px',
            fontWeight: 800, fontSize: 18,
            color: result === 'correct' ? '#065F46' : '#991B1B',
            textAlign: 'center',
          }}>
            {result === 'correct'
              ? '🎉 Perfekt! Well done!'
              : `❌ "${scene.preposition}" means ${scene.instruction.toLowerCase().replace('put the ', '').replace('the ', '').split(' ').slice(1).join(' ')}`}
          </div>
          <button
            onClick={handleNext}
            data-testid="drag-next"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
              border: 'none', borderRadius: 999, padding: '14px 40px',
              color: 'white', fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800, fontSize: 18, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
            }}
          >
            {current + 1 >= scenes.length ? 'Finish! 🏆' : 'Next Scene ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
