import { useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { fetchTopics } from '../api/topics'
import { PageHeader } from '../components/layout/PageHeader'
import type { Topic } from '../types/topic'

export function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchTopics()
        if (!cancelled) {
          setTopics(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Erro ao carregar tópicos')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <PageHeader
        title="anki-do"
        subtitle="Escolha um tópico para estudar ou use Random."
      />

      {loading ? <p>Carregando tópicos...</p> : null}
      {error ? <p className="error-message">{error}</p> : null}

      {!loading && !error ? (
        <ul className="topic-preview-list">
          {topics.length === 0 ? (
            <li>Nenhum tópico cadastrado ainda.</li>
          ) : (
            topics.map((topic) => (
              <li key={topic.id}>
                {topic.name} ({topic.card_count ?? 0} cards)
              </li>
            ))
          )}
        </ul>
      ) : null}
    </section>
  )
}
