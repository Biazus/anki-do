import { useRef, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { createCard } from '../../api/cards'
import type { Topic } from '../../types/topic'
import { Button } from '../ui/Button'
import { CharCounter } from '../ui/CharCounter'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const QUESTION_MAX = 280
const ANSWER_MAX = 800
const EXTENDED_MAX = 3000
const SUBMIT_DEBOUNCE_MS = 500

interface CardFormProps {
  topics: Topic[]
}

export function CardForm({ topics }: CardFormProps) {
  const [topicId, setTopicId] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [extendedDescription, setExtendedDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const lastSubmitAt = useRef(0)

  const trimmedQuestion = question.trim()
  const trimmedAnswer = answer.trim()
  const trimmedExtended = extendedDescription.trim()

  const questionTooLong = question.length > QUESTION_MAX
  const answerTooLong = answer.length > ANSWER_MAX
  const extendedTooLong = extendedDescription.length > EXTENDED_MAX

  const parsedTopicId = Number(topicId)
  const hasValidTopic = topicId !== '' && parsedTopicId > 0

  const canSubmit =
    !submitting &&
    hasValidTopic &&
    trimmedQuestion.length > 0 &&
    trimmedAnswer.length > 0 &&
    !questionTooLong &&
    !answerTooLong &&
    !extendedTooLong

  function resetCardFields() {
    setQuestion('')
    setAnswer('')
    setExtendedDescription('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const now = Date.now()
    if (now - lastSubmitAt.current < SUBMIT_DEBOUNCE_MS) {
      return
    }

    if (!canSubmit) {
      return
    }

    lastSubmitAt.current = now
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await createCard({
        topic_id: parsedTopicId,
        question: trimmedQuestion,
        answer: trimmedAnswer,
        extended_description: trimmedExtended || null,
      })

      resetCardFields()
      setSuccess('Card criado com sucesso!')
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('Tópico não encontrado. Selecione outro tópico.')
      } else {
        setError(err instanceof ApiError ? err.message : 'Erro ao criar card.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const topicOptions = topics.map((topic) => ({
    value: String(topic.id),
    label: topic.name,
  }))

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <Select
        id="card-topic"
        label="Tópico"
        value={topicId}
        placeholder="Selecione um tópico"
        options={topicOptions}
        disabled={submitting}
        onChange={(event) => setTopicId(event.target.value)}
        error={!hasValidTopic && topicId !== '' ? 'Selecione um tópico válido.' : null}
      />

      <div className="card-form__field">
        <Input
          id="card-question"
          label="Pergunta"
          value={question}
          maxLength={QUESTION_MAX}
          placeholder="Frente do card"
          disabled={submitting}
          onChange={(event) => setQuestion(event.target.value)}
          error={questionTooLong ? `Máximo de ${QUESTION_MAX} caracteres.` : null}
        />
        <CharCounter current={question.length} max={QUESTION_MAX} />
      </div>

      <div className="card-form__field">
        <Textarea
          id="card-answer"
          label="Resposta"
          value={answer}
          maxLength={ANSWER_MAX}
          rows={4}
          placeholder="Verso do card"
          disabled={submitting}
          onChange={(event) => setAnswer(event.target.value)}
          error={answerTooLong ? `Máximo de ${ANSWER_MAX} caracteres.` : null}
        />
        <CharCounter current={answer.length} max={ANSWER_MAX} />
      </div>

      <div className="card-form__field">
        <Textarea
          id="card-extended"
          label="Descrição extendida (opcional)"
          value={extendedDescription}
          maxLength={EXTENDED_MAX}
          rows={6}
          placeholder="Detalhes extras exibidos no painel lateral durante o estudo"
          disabled={submitting}
          onChange={(event) => setExtendedDescription(event.target.value)}
          error={extendedTooLong ? `Máximo de ${EXTENDED_MAX} caracteres.` : null}
        />
        <CharCounter current={extendedDescription.length} max={EXTENDED_MAX} />
      </div>

      {error ? <p className="error-message">{error}</p> : null}
      {success ? <p className="success-message">{success}</p> : null}

      <Button type="submit" disabled={!canSubmit} aria-label="Salvar novo card">
        {submitting ? 'Salvando...' : 'Criar card'}
      </Button>
    </form>
  )
}
