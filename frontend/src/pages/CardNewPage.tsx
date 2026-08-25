import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { fetchTopics } from '../api/topics'
import { CardForm } from '../components/cards/CardForm'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { Topic } from '../types/topic'

export function CardNewPage() {
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

  return (
    <section>
      <PageHeader
        title="Novo Card"
        subtitle="Cadastre pergunta, resposta e descrição extendida opcional."
      />

      {loading ? <LoadingSpinner /> : null}

      {error ? (
        <ErrorState message={error} onRetry={loadTopics} />
      ) : null}

      {!loading && !error && topics.length === 0 ? (
        <EmptyState
          title="Nenhum tópico disponível"
          description="Crie um tópico antes de cadastrar cards."
        >
          <Link to="/topics" className="btn btn--primary">
            Ir para Tópicos
          </Link>
        </EmptyState>
      ) : null}

      {!loading && !error && topics.length > 0 ? <CardForm topics={topics} /> : null}
    </section>
  )
}
