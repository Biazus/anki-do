import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { fetchTopics } from '../api/topics'
import { PageHeader } from '../components/layout/PageHeader'
import { TopicForm } from '../components/topics/TopicForm'
import { TopicList } from '../components/topics/TopicList'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { Topic } from '../types/topic'

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTopics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchTopics()
      setTopics(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar tópicos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTopics()
  }, [loadTopics])

  function handleTopicCreated(topic: Topic) {
    setTopics((current) =>
      [...current, topic].sort((a, b) => a.name.localeCompare(b.name)),
    )
  }

  return (
    <section>
      <PageHeader
        title="Tópicos"
        subtitle="Crie tópicos para organizar seus flashcards."
      />

      <TopicForm onCreated={handleTopicCreated} />

      <div className="topics-section">
        <h2 className="section-title">Tópicos cadastrados</h2>

        {loading ? <LoadingSpinner /> : null}
        {error ? <p className="error-message">{error}</p> : null}

        {!loading && !error && topics.length === 0 ? (
          <EmptyState
            title="Nenhum tópico ainda"
            description="Use o formulário acima para criar o primeiro tópico."
          />
        ) : null}

        {!loading && !error && topics.length > 0 ? <TopicList topics={topics} /> : null}
      </div>
    </section>
  )
}
