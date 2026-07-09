import { useState } from 'react'
import type { DragScene } from '../data/prepositions'

interface Props {
  scenes: DragScene[]
  onComplete: (score: number) => void
}

// Self-explanatory SVG position diagrams — large and clear
function ZoneIcon({ type, color }: { type: string; color: string }) {
  const W = 72
  const H = 72
  const plat = '#B0BEC5'   // platform / container colour
  const sub = color         // subject dot colour

  if (type === 'on') {
    return (
      <svg width={W} height={H} viewBox="0 0 72 72" fill="none">
        {/* Platform shelf */}
        <rect x="8" y="46" width="56" height="12" rx="6" fill={plat} />
        {/* Subject dot ON TOP */}
        <circle cx="36" cy="30" r="13" fill={sub} />
        <circle cx="36" cy="30" r="8" fill="white" fillOpacity="0.45" />
        {/* Small down-arrow showing ON */}
        <path d="M36 45 L36 46" stroke={sub} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'under') {
    return (
      <svg width={W} height={H} viewBox="0 0 72 72" fill="none">
        {/* Platform shelf */}
        <rect x="8" y="14" width="56" height="12" rx="6" fill={plat} />
        {/* Subject dot BELOW */}
        <circle cx="36" cy="50" r="13" fill={sub} />
        <circle cx="36" cy="50" r="8" fill="white" fillOpacity="0.45" />
        <path d="M36 26 L36 37" stroke={sub} strokeWidth="3" strokeLinecap="round"
          markerEnd="url(#arr)" />
      </svg>
    )
  }
  if (type === 'inside') {
    return (
      <svg width={W} height={H} viewBox="0 0 72 72" fill="none">
        {/* Open box (U shape) */}
        <rect x="10" y="24" width="52" height="40" rx="6" fill={plat} fillOpacity="0.35" />
        <rect x="10" y="24" width="8" height="40" rx="4" fill={plat} />
        <rect x="54" y="24" width="8" height="40" rx="4" fill={plat} />
        <rect x="10" y="56" width="52" height="8" rx="4" fill={plat} />
        {/* Subject INSIDE */}
        <circle cx="36" cy="42" r="12" fill={sub} />
        <circle cx="36" cy="42" r="7" fill="white" fillOpacity="0.45" />
      </svg>
    )
  }
  if (type === 'above') {
    return (
      <svg width={W} height={H} viewBox="0 0 72 72" fill="none">
        {/* Simple house silhouette */}
        <rect x="14" y="42" width="44" height="24" rx="4" fill={plat} />
        <polygon points="10,44 36,22 62,44" fill={plat} fillOpacity="0.7" />
        {/* Subject ABOVE */}
        <circle cx="36" cy="11" r="9" fill={sub} />
        <circle cx="36" cy="11" r="5" fill="white" fillOpacity="0.45" />
      </svg>
    )
  }
  // beside / next to
  return (
    <svg width={W} height={H} viewBox="0 0 72 72" fill="none">
      {/* Reference block (right) */}
      <rect x="40" y="22" width="24" height="30" rx="6" fill={plat} />
      {/* Subject circle (LEFT of block) */}
      <circle cx="22" cy="37" r="13" fill={sub} />
      <circle cx="22" cy="37" r="8" fill="white" fillOpacity="0.45" />
    </svg>
  )
}

const ZONE_ACCENT = ['#8B5CF6', '#0EA5E9', '#10B981']

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
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 900, fontSize: 52, color: '#10B981', lineHeight: 1 }}>
          {finalScore}<span style={{ fontSize: 28, color: '#9CA3AF' }}>/{scenes.length}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#374151', marginTop: 8 }}>
          {pct >= 80 ? 'Superstar! 🌟' : 'Bra jobbat! / Great effort! 💪'}
        </div>
      </div>
    )
  }

  const progress = (current / scenes.length) * 100

  return (
    <div data-testid="drag-drop" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Scen {current + 1} / {scenes.length}</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#6B7280' }}>Poäng / Score: {score} ⭐</span>
        </div>
        <div style={{ height: 10, background: '#D1FAE5', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #10B981, #06B6D4)',
            borderRadius: 999, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Instruction banner — both languages */}
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: 20, padding: '16px 20px', textAlign: 'center',
        boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -15, right: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        {/* Swedish first — big */}
        <div style={{
          fontFamily: "'Baloo 2', sans-serif", fontWeight: 900,
          fontSize: 22, color: 'white', lineHeight: 1.2,
          textShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}>
          🇸🇪 {scene.instructionSwedish}
        </div>
        {/* English below — smaller */}
        <div style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
          🇬🇧 {scene.instruction}
        </div>
      </div>

      {/* Main scene card */}
      <div style={{
        background: 'white', borderRadius: 24,
        boxShadow: '0 6px 28px rgba(0,0,0,0.08)',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>

        {/* Draggable subject */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 6,
          }}>
            Dra eller tryck! / Drag or tap!
          </div>
          <div
            draggable
            onDragStart={handleDragStart}
            data-testid="drag-subject"
            style={{
              fontSize: 72, lineHeight: 1, cursor: 'grab',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
              display: 'inline-block',
            }}
          >
            {scene.subjectEmoji}
          </div>
        </div>

        {/* Drop zones — with SVG diagrams */}
        <div style={{ width: '100%' }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: '#6B7280',
            textAlign: 'center', marginBottom: 10, letterSpacing: 0.5,
          }}>
            Var ska den vara? / Where does it go?
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {scene.zones.map((zone, i) => {
              const accent = ZONE_ACCENT[i % 3]
              let border = `3px solid ${accent}44`
              let bg = '#FAFAFA'
              let extraShadow = 'none'
              let overlay = ''

              if (dragOver === zone.id && !result) {
                border = `3px solid ${accent}`
                bg = `${accent}11`
              }
              if (result) {
                if (zone.correct) {
                  border = '3px solid #10B981'; bg = '#D1FAE5'
                  extraShadow = '0 0 0 4px rgba(16,185,129,0.2)'
                  overlay = '✅'
                } else if (tapped === zone.id) {
                  border = '3px solid #EF4444'; bg = '#FEE2E2'
                  extraShadow = '0 0 0 4px rgba(239,68,68,0.15)'
                  overlay = '❌'
                }
              }

              // split "Swedish / English" label
              const [swLabel, enLabel] = zone.label.split(' / ')

              return (
                <div
                  key={zone.id}
                  data-testid={`drop-zone-${zone.id}`}
                  onClick={() => selectZone(zone.id)}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(zone.id) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(null); selectZone(zone.id) }}
                  style={{
                    flex: 1, minWidth: 0,
                    border, background: bg,
                    borderRadius: 18, padding: '12px 6px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    cursor: result ? 'default' : 'pointer',
                    boxShadow: extraShadow,
                    transition: 'all 0.2s ease',
                    transform: dragOver === zone.id && !result ? 'scale(1.05)' : 'scale(1)',
                    position: 'relative',
                  }}
                >
                  {overlay ? (
                    <div style={{ fontSize: 32, lineHeight: 1 }}>{overlay}</div>
                  ) : (
                    <ZoneIcon type={zone.emoji} color={accent} />
                  )}
                  {/* Swedish label */}
                  <div style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontWeight: 900, fontSize: 13, color: accent,
                    lineHeight: 1, textAlign: 'center',
                  }}>
                    {swLabel}
                  </div>
                  {/* English label */}
                  <div style={{
                    fontSize: 10, fontWeight: 600,
                    color: '#9CA3AF', lineHeight: 1, textAlign: 'center',
                  }}>
                    {enLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Target object */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
            {scene.targetEmoji}
          </div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
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
              ? '🎉 Perfekt! / Well done!'
              : `❌ "${scene.preposition}" = ${scene.instruction.split(' ').slice(3).join(' ')}`}
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
            {current + 1 >= scenes.length ? 'Klart! / Finish! 🏆' : 'Nästa / Next ▶'}
          </button>
        </div>
      )}
    </div>
  )
}
