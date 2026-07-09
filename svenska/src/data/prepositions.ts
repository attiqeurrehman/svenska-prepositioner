export interface Preposition {
  swedish: string
  english: string
  emoji: string
  color: string
}

export interface Scene {
  id: string
  preposition: string
  description: string
  subjectEmoji: string
  containerEmoji: string
  subjectLabel: string
  containerLabel: string
  // CSS class or style hint for drag-drop zone position
  dropZone: 'on-top' | 'below' | 'inside' | 'behind' | 'front' | 'beside' | 'above' | 'between'
}

export const PREPOSITIONS: Preposition[] = [
  { swedish: 'på', english: 'on', emoji: '🐱', color: '#DC2626' },
  { swedish: 'under', english: 'under', emoji: '🐢', color: '#2563EB' },
  { swedish: 'i', english: 'in', emoji: '🎁', color: '#059669' },
  { swedish: 'bakom', english: 'behind', emoji: '🙈', color: '#7C3AED' },
  { swedish: 'framför', english: 'in front of', emoji: '🦁', color: '#D97706' },
  { swedish: 'bredvid', english: 'next to', emoji: '🤝', color: '#DB2777' },
  { swedish: 'över', english: 'above', emoji: '🦅', color: '#0284C7' },
  { swedish: 'mellan', english: 'between', emoji: '🥪', color: '#16A34A' },
]

export interface QuizQuestion {
  id: string
  sceneDescription: string
  correctAnswer: string
  options: string[]
  subjectEmoji: string
  containerEmoji: string
  prepositionDesc: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    sceneDescription: 'Katten sitter på bordet',
    correctAnswer: 'på',
    options: ['på', 'under', 'i', 'bredvid'],
    subjectEmoji: '🐱',
    containerEmoji: '🪑',
    prepositionDesc: 'The cat is sitting ON the table',
  },
  {
    id: 'q2',
    sceneDescription: 'Hunden sover under sängen',
    correctAnswer: 'under',
    options: ['på', 'under', 'bakom', 'över'],
    subjectEmoji: '🐶',
    containerEmoji: '🛏️',
    prepositionDesc: 'The dog is sleeping UNDER the bed',
  },
  {
    id: 'q3',
    sceneDescription: 'Äpplet ligger i korgen',
    correctAnswer: 'i',
    options: ['på', 'i', 'bredvid', 'bakom'],
    subjectEmoji: '🍎',
    containerEmoji: '🧺',
    prepositionDesc: 'The apple is IN the basket',
  },
  {
    id: 'q4',
    sceneDescription: 'Fågeln flyger över huset',
    correctAnswer: 'över',
    options: ['under', 'i', 'över', 'framför'],
    subjectEmoji: '🐦',
    containerEmoji: '🏠',
    prepositionDesc: 'The bird is flying ABOVE the house',
  },
  {
    id: 'q5',
    sceneDescription: 'Bollen är bredvid trädet',
    correctAnswer: 'bredvid',
    options: ['bakom', 'bredvid', 'på', 'under'],
    subjectEmoji: '⚽',
    containerEmoji: '🌳',
    prepositionDesc: 'The ball is NEXT TO the tree',
  },
  {
    id: 'q6',
    sceneDescription: 'Katten gömmer sig bakom dörren',
    correctAnswer: 'bakom',
    options: ['framför', 'bakom', 'i', 'över'],
    subjectEmoji: '🐱',
    containerEmoji: '🚪',
    prepositionDesc: 'The cat is hiding BEHIND the door',
  },
  {
    id: 'q7',
    sceneDescription: 'Hunden sitter framför TV:n',
    correctAnswer: 'framför',
    options: ['bakom', 'framför', 'bredvid', 'under'],
    subjectEmoji: '🐶',
    containerEmoji: '📺',
    prepositionDesc: 'The dog is sitting IN FRONT OF the TV',
  },
  {
    id: 'q8',
    sceneDescription: 'Blomman står mellan fönstren',
    correctAnswer: 'mellan',
    options: ['mellan', 'på', 'i', 'under'],
    subjectEmoji: '🌸',
    containerEmoji: '🪟',
    prepositionDesc: 'The flower is standing BETWEEN the windows',
  },
]

export interface DragScene {
  id: string
  instruction: string
  instructionSwedish: string
  preposition: string
  subjectEmoji: string
  targetLabel: string
  targetEmoji: string
  zones: { id: string; label: string; emoji: string; correct: boolean }[]
}

export const DRAG_SCENES: DragScene[] = [
  {
    id: 'd1',
    instruction: 'Put the cat ON the box',
    instructionSwedish: 'Sätt katten PÅ lådan',
    preposition: 'på',
    subjectEmoji: '🐱',
    targetLabel: 'lådan / box',
    targetEmoji: '📦',
    zones: [
      { id: 'on', label: 'På / On top', emoji: 'on', correct: true },
      { id: 'under', label: 'Under / Under', emoji: 'under', correct: false },
      { id: 'beside', label: 'Bredvid / Beside', emoji: 'beside', correct: false },
    ],
  },
  {
    id: 'd2',
    instruction: 'Put the dog UNDER the bed',
    instructionSwedish: 'Sätt hunden UNDER sängen',
    preposition: 'under',
    subjectEmoji: '🐶',
    targetLabel: 'sängen / bed',
    targetEmoji: '🛏️',
    zones: [
      { id: 'on', label: 'På / On top', emoji: 'on', correct: false },
      { id: 'under', label: 'Under / Under', emoji: 'under', correct: true },
      { id: 'beside', label: 'Bredvid / Beside', emoji: 'beside', correct: false },
    ],
  },
  {
    id: 'd3',
    instruction: 'Put the apple IN the basket',
    instructionSwedish: 'Sätt äpplet I korgen',
    preposition: 'i',
    subjectEmoji: '🍎',
    targetLabel: 'korgen / basket',
    targetEmoji: '🧺',
    zones: [
      { id: 'on', label: 'På / On top', emoji: 'on', correct: false },
      { id: 'inside', label: 'I / Inside', emoji: 'inside', correct: true },
      { id: 'beside', label: 'Bredvid / Beside', emoji: 'beside', correct: false },
    ],
  },
  {
    id: 'd4',
    instruction: 'Put the bird ABOVE the house',
    instructionSwedish: 'Sätt fågeln ÖVER huset',
    preposition: 'över',
    subjectEmoji: '🐦',
    targetLabel: 'huset / house',
    targetEmoji: '🏠',
    zones: [
      { id: 'above', label: 'Över / Above', emoji: 'above', correct: true },
      { id: 'under', label: 'Under / Under', emoji: 'under', correct: false },
      { id: 'beside', label: 'Bredvid / Beside', emoji: 'beside', correct: false },
    ],
  },
  {
    id: 'd5',
    instruction: 'Put the ball NEXT TO the tree',
    instructionSwedish: 'Sätt bollen BREDVID trädet',
    preposition: 'bredvid',
    subjectEmoji: '⚽',
    targetLabel: 'trädet / tree',
    targetEmoji: '🌳',
    zones: [
      { id: 'on', label: 'På / On top', emoji: 'on', correct: false },
      { id: 'under', label: 'Under / Under', emoji: 'under', correct: false },
      { id: 'beside', label: 'Bredvid / Next to', emoji: 'beside', correct: true },
    ],
  },
]
