let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(
  freq: number,
  start: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
) {
  const c = getCtx()
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.connect(g)
  g.connect(c.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  g.gain.setValueAtTime(gain, start)
  g.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.start(start)
  osc.stop(start + duration + 0.01)
}

export function playCorrect() {
  const t = getCtx().currentTime
  tone(523, t, 0.14, 0.28)       // C5
  tone(659, t + 0.1, 0.14, 0.28) // E5
  tone(784, t + 0.2, 0.28, 0.32) // G5
}

export function playWrong() {
  const t = getCtx().currentTime
  tone(330, t, 0.14, 0.22, 'sawtooth')
  tone(277, t + 0.14, 0.22, 0.18, 'sawtooth')
}

export function playFlip() {
  const t = getCtx().currentTime
  tone(900, t, 0.05, 0.12)
  tone(450, t + 0.04, 0.08, 0.08)
}

export function playComplete() {
  const t = getCtx().currentTime
  tone(523, t, 0.12, 0.28)
  tone(659, t + 0.12, 0.12, 0.28)
  tone(784, t + 0.24, 0.12, 0.28)
  tone(1047, t + 0.36, 0.45, 0.32)
}
