export type SessionStatus = 'idle' | 'loading' | 'pending' | 'completed' | 'error'

export type StudyMode =
  | { type: 'topic'; topicId: number }
  | { type: 'random' }

export interface StudyCard {
  id: number
  topic_id: number
  question: string
  answer: string
  extended_description: string | null
}

export interface UseStudySessionOptions {
  mode: StudyMode
  onSessionEnd: () => void
}

export interface UseStudySessionReturn {
  status: SessionStatus
  error: string | null
  currentCard: StudyCard | null
  currentIndex: number
  totalCards: number
  progressLabel: string
  isFlipped: boolean
  isExtendedOpen: boolean
  hasExtended: boolean
  canShowExtended: boolean
  flip: () => void
  toggleExtended: () => void
  next: () => void
  exit: () => void
}
