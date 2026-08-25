import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { fetchTopics } from '../api/topics'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { Topic } from '../types/topic'

function totalCardCount(topics: Topic[]): number {
  return topics.reduce((sum, topic) => sum + (topic.card_count ?? 0), 0)
}

export function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalCards = useMemo(() => totalCardCount(topics), [topics])
  const canRandom = totalCards > 0

  async function loadTopics() {
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
  }

  useEffect(() => {
    loadTopics()
  }, [])

  return (
    <section className="home-page">
      <PageHeader
        title="anki-do"
        subtitle="Escolha um tópico para estudar ou use Random."
      />

      <div className="home-actions">
        <div className="home-random">
          {canRandom ? (
            <Link
              to="/study/random"
              className="btn btn--primary"
              aria-label={`Estudar ${totalCards} cards aleatórios de todos os tópicos`}
            >
              Random
            </Link>
          ) : (
            <Button
              disabled
              aria-label="Random indisponível: cadastre cards para estudar em modo aleatório"
            >
              Random
            </Button>
          )}
          <p className="home-random__hint">
            {canRandom
              ? `${totalCards} cards de todos os tópicos`
              : 'Disponível quando houver pelo menos um card cadastrado.'}
          </p>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : null}

      {error ? (
        <ErrorState message={error} onRetry={loadTopics} />
      ) : null}

      {!loading && !error && topics.length === 0 ? (
        <EmptyState
          title="Nenhum tópico cadastrado"
          description="Comece criando um tópico e depois cadastre seus primeiros cards."
        >
          <Link to="/topics" className="btn btn--primary">
            Criar tópico
          </Link>
        </EmptyState>
      ) : null}

      {!loading && !error && topics.length > 0 ? (
        <div className="home-topics">
          <h2 className="section-title">Tópicos</h2>

          {totalCards === 0 ? (
            <EmptyState
              title="Nenhum card cadastrado"
              description="Crie cards para liberar o estudo por tópico e o modo Random."
            >
              <Link to="/cards/new" className="btn btn--primary">
                Cadastrar card
              </Link>
            </EmptyState>
          ) : null}

          <ul className="home-topic-list">
            {topics.map((topic) => {
              const cardCount = topic.card_count ?? 0
              const canStudy = cardCount > 0

              return (
                <li key={topic.id} className="home-topic-list__item">
                  <div className="home-topic-list__info">
                    <span className="home-topic-list__name">{topic.name}</span>
                    <span className="home-topic-list__count">
                      {cardCount} {cardCount === 1 ? 'card' : 'cards'}
                    </span>
                  </div>

                  {canStudy ? (
                    <Link
                      to={`/study/${topic.id}`}
                      className="btn btn--secondary"
                      aria-label={`Estudar tópico ${topic.name}`}
                    >
                      Estudar
                    </Link>
                  ) : (
                    <Button
                      disabled
                      aria-label={`Estudar tópico ${topic.name} indisponível: sem cards`}
                    >
                      Estudar
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
