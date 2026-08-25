import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchTopics } from '../api/topics'
import { ExtendedPanel } from '../components/study/ExtendedPanel'
import { StudyActions } from '../components/study/StudyActions'
import { StudyCard } from '../components/study/StudyCard'
import { StudyLayout } from '../components/study/StudyLayout'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useStudyKeyboard } from '../hooks/useStudyKeyboard'
import { useStudySession } from '../hooks/useStudySession'
import type { StudyMode } from '../types/study'

function InvalidStudyRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return null
}

interface StudySessionViewProps {
  mode: StudyMode
}

function StudySessionView({ mode }: StudySessionViewProps) {
  const navigate = useNavigate()
  const [topicLabel, setTopicLabel] = useState<string | null>(null)

  const session = useStudySession({
    mode,
    onSessionEnd: () => navigate('/'),
  })

  useStudyKeyboard({
    enabled: session.status === 'pending',
    isFlipped: session.isFlipped,
    onFlip: session.flip,
    onNext: session.next,
    onExit: session.exit,
  })

  useEffect(() => {
    if (mode.type !== 'topic') {
      setTopicLabel(null)
      return
    }

    const topicId = mode.topicId
    let cancelled = false

    async function loadTopicName() {
      try {
        const topics = await fetchTopics()
        if (cancelled) {
          return
        }

        const topic = topics.find((item) => item.id === topicId)
        setTopicLabel(topic?.name ?? `Tópico #${topicId}`)
      } catch {
        if (!cancelled) {
          setTopicLabel(`Tópico #${topicId}`)
        }
      }
    }

    loadTopicName()

    return () => {
      cancelled = true
    }
  }, [mode])

  const layoutTitle = useMemo(() => {
    if (mode.type === 'random') {
      return 'Random'
    }

    return topicLabel ? `Tópico: ${topicLabel}` : 'Carregando tópico...'
  }, [mode, topicLabel])

  if (session.status === 'loading' || session.status === 'completed') {
    return <LoadingSpinner />
  }

  if (session.status === 'error') {
    return (
      <ErrorState message={session.error ?? 'Erro ao carregar sessão de estudo.'}>
        <Link to="/" className="btn btn--secondary">
          Voltar para Home
        </Link>
      </ErrorState>
    )
  }

  if (session.status !== 'pending' || !session.currentCard) {
    return null
  }

  const extendedDescription = session.currentCard.extended_description?.trim() ?? ''

  return (
    <StudyLayout
      title={layoutTitle}
      progressLabel={session.progressLabel}
      onExit={session.exit}
      card={
        <StudyCard
          question={session.currentCard.question}
          answer={session.currentCard.answer}
          isFlipped={session.isFlipped}
        />
      }
      actions={
        <StudyActions
          isFlipped={session.isFlipped}
          onFlip={session.flip}
          onNext={session.next}
        />
      }
      extendedPanel={
        session.canShowExtended ? (
          <ExtendedPanel
            description={extendedDescription}
            isFlipped={session.isFlipped}
            isOpen={session.isExtendedOpen}
            canShow={session.canShowExtended}
            onToggle={session.toggleExtended}
          />
        ) : null
      }
    />
  )
}

export function StudyPage() {
  const { topicId } = useParams()
  const location = useLocation()
  const isRandom = location.pathname === '/study/random'

  const mode = useMemo((): StudyMode | null => {
    if (isRandom) {
      return { type: 'random' }
    }

    const parsedId = Number(topicId)
    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      return null
    }

    return { type: 'topic', topicId: parsedId }
  }, [isRandom, topicId])

  if (mode === null) {
    return <InvalidStudyRedirect />
  }

  return (
    <section className="study-page" aria-label="Sessão de estudo">
      <StudySessionView mode={mode} />
    </section>
  )
}
