import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCardsByTopic, fetchRandomCards } from '../api/cards'
import { ApiError } from '../api/client'
import type { Card } from '../types/card'
import type {
  StudyCard,
  StudyMode,
  SessionStatus,
  UseStudySessionOptions,
  UseStudySessionReturn,
} from '../types/study'
import { fisherYatesShuffle } from '../utils/shuffle'

function toStudyCard(card: Card): StudyCard {
  return {
    id: card.id,
    topic_id: card.topic_id,
    question: card.question,
    answer: card.answer,
    extended_description: card.extended_description,
  }
}

function hasExtendedDescription(card: StudyCard | null): boolean {
  return Boolean(card?.extended_description?.trim())
}

async function fetchCardsByMode(mode: StudyMode): Promise<Card[]> {
  if (mode.type === 'random') {
    return fetchRandomCards()
  }

  return fetchCardsByTopic(mode.topicId)
}

export function useStudySession({
  mode,
  onSessionEnd,
}: UseStudySessionOptions): UseStudySessionReturn {
  const queueRef = useRef<StudyCard[]>([])
  const onSessionEndRef = useRef(onSessionEnd)

  const [status, setStatus] = useState<SessionStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isExtendedOpen, setIsExtendedOpen] = useState(false)
  const [queueLength, setQueueLength] = useState(0)

  onSessionEndRef.current = onSessionEnd

  const endSession = useCallback(() => {
    setStatus('completed')
    onSessionEndRef.current()
  }, [])

  const modeKey =
    mode.type === 'random' ? 'random' : `topic:${mode.topicId}`

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setError(null)
      setCurrentIndex(0)
      setIsFlipped(false)
      setIsExtendedOpen(false)
      queueRef.current = []
      setQueueLength(0)

      try {
        const cards = await fetchCardsByMode(mode)

        if (cancelled) {
          return
        }

        if (cards.length === 0) {
          endSession()
          return
        }

        queueRef.current = fisherYatesShuffle(cards.map(toStudyCard))
        setQueueLength(queueRef.current.length)
        setStatus('pending')
      } catch (err) {
        if (cancelled) {
          return
        }

        setError(err instanceof ApiError ? err.message : 'Erro ao carregar cards.')
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [modeKey, mode, endSession])

  const totalCards = queueLength
  const currentCard = queueRef.current[currentIndex] ?? null
  const hasExtended = hasExtendedDescription(currentCard)
  const canShowExtended = isFlipped && hasExtended
  const progressLabel =
    totalCards > 0 ? `${currentIndex + 1} / ${totalCards}` : '0 / 0'

  const flip = useCallback(() => {
    setIsFlipped(true)
  }, [])

  const toggleExtended = useCallback(() => {
    const card = queueRef.current[currentIndex]

    if (!isFlipped || !hasExtendedDescription(card)) {
      return
    }

    setIsExtendedOpen((open) => !open)
  }, [currentIndex, isFlipped])

  const next = useCallback(() => {
    const nextIndex = currentIndex + 1
    setIsFlipped(false)
    setIsExtendedOpen(false)

    if (nextIndex >= queueRef.current.length) {
      endSession()
      return
    }

    setCurrentIndex(nextIndex)
  }, [currentIndex, endSession])

  const exit = useCallback(() => {
    endSession()
  }, [endSession])

  return {
    status,
    error,
    currentCard,
    currentIndex,
    totalCards,
    progressLabel,
    isFlipped,
    isExtendedOpen,
    hasExtended,
    canShowExtended,
    flip,
    toggleExtended,
    next,
    exit,
  }
}
