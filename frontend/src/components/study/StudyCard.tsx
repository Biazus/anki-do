import { isFlip3dSupported } from '../../utils/flipSupport'

interface StudyCardProps {
  question: string
  answer: string
  isFlipped: boolean
}

export function StudyCard({ question, answer, isFlipped }: StudyCardProps) {
  const use3dFlip = isFlip3dSupported()

  if (!use3dFlip) {
    return (
      <div
        className={`study-card study-card--fade ${isFlipped ? 'study-card--fade-flipped' : ''}`}
        aria-live="polite"
      >
        <div className="study-card__content">
          <p className="study-card__label">{isFlipped ? 'Resposta' : 'Pergunta'}</p>
          <p className="study-card__text">{isFlipped ? answer : question}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="study-card-container" aria-live="polite">
      <div className={`study-card-inner ${isFlipped ? 'study-card-inner--flipped' : ''}`}>
        <div
          className="study-card-face study-card-face--front"
          aria-hidden={isFlipped}
        >
          <p className="study-card__label">Pergunta</p>
          <p className="study-card__text">{question}</p>
        </div>
        <div
          className="study-card-face study-card-face--back"
          aria-hidden={!isFlipped}
        >
          <p className="study-card__label">Resposta</p>
          <p className="study-card__text">{answer}</p>
        </div>
      </div>
    </div>
  )
}
