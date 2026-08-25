import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStudySession } from '../hooks/useStudySession'
import { PageHeader } from '../components/layout/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
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
  subtitle: string
}

function StudySessionView({ mode, subtitle }: StudySessionViewProps) {
  const navigate = useNavigate()

  const session = useStudySession({
    mode,
    onSessionEnd: () => navigate('/'),
  })

  return (
    <section className="study-page">
      <PageHeader title="Estudo" subtitle={subtitle} />

      {session.status === 'loading' || session.status === 'completed' ? (
        <LoadingSpinner />
      ) : null}

      {session.status === 'error' ? (
        <p className="error-message">{session.error}</p>
      ) : null}

      {session.status === 'pending' && session.currentCard ? (
        <div className="study-page__preview">
          <p className="study-page__progress">{session.progressLabel}</p>
          <p className="study-page__question">{session.currentCard.question}</p>
          <p className="study-page__hint">UI completa na próxima etapa.</p>
        </div>
      ) : null}
    </section>
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

  const subtitle =
    mode.type === 'random'
      ? 'Modo aleatório — todos os tópicos.'
      : `Tópico #${mode.topicId}`

  return <StudySessionView mode={mode} subtitle={subtitle} />
}
