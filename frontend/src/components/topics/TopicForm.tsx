import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { createTopic } from '../../api/topics'
import type { Topic } from '../../types/topic'
import { Button } from '../ui/Button'
import { CharCounter } from '../ui/CharCounter'
import { Input } from '../ui/Input'

const TOPIC_NAME_MAX = 60

interface TopicFormProps {
  onCreated: (topic: Topic) => void
}

export function TopicForm({ onCreated }: TopicFormProps) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = name.trim()
  const isTooLong = name.length > TOPIC_NAME_MAX
  const isEmpty = trimmed.length === 0
  const canSubmit = !submitting && !isEmpty && !isTooLong

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const topic = await createTopic({ name: trimmed })
      setName('')
      onCreated(topic)
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Já existe um tópico com esse nome.')
      } else {
        setError(err instanceof ApiError ? err.message : 'Erro ao criar tópico.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="topic-form" onSubmit={handleSubmit}>
      <div className="topic-form__field">
        <Input
          id="topic-name"
          label="Nome do tópico"
          value={name}
          maxLength={TOPIC_NAME_MAX}
          placeholder="Ex.: Python, História do Brasil..."
          disabled={submitting}
          onChange={(event) => setName(event.target.value)}
          error={isTooLong ? `Máximo de ${TOPIC_NAME_MAX} caracteres.` : null}
        />
        <CharCounter current={name.length} max={TOPIC_NAME_MAX} />
      </div>

      {error ? <p className="error-message">{error}</p> : null}

      <Button type="submit" disabled={!canSubmit} aria-label="Criar novo tópico">
        {submitting ? 'Criando...' : 'Criar tópico'}
      </Button>
    </form>
  )
}
