import '@testing-library/jest-dom'

// Web Audio API is not available in jsdom — stub it out
class MockAudioContext {
  currentTime = 0
  state = 'running'
  destination = {}
  resume() {}
  createOscillator() {
    return { connect() {}, type: '', frequency: { setValueAtTime() {} }, start() {}, stop() {} }
  }
  createGain() {
    return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }
  }
}
// @ts-expect-error jsdom stub
globalThis.AudioContext = MockAudioContext
