import { useEffect, useState } from 'react'

const PARTICLES = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '⭐', '✨']

interface Particle {
  id: number
  emoji: string
  x: number
  delay: number
  size: number
}

interface Props {
  active: boolean
}

export function Confetti({ active }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) { setParticles([]); return }
    setParticles(
      PARTICLES.map((emoji, i) => ({
        id: Date.now() + i,
        emoji,
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.25,
        size: 18 + Math.random() * 18,
      }))
    )
    const t = setTimeout(() => setParticles([]), 900)
    return () => clearTimeout(t)
  }, [active])

  if (!particles.length) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            bottom: '20%',
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
