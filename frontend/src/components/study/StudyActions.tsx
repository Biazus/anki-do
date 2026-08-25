import { Button } from '../ui/Button'

interface StudyActionsProps {
  isFlipped: boolean
  onFlip: () => void
  onNext: () => void
}

export function StudyActions({ isFlipped, onFlip, onNext }: StudyActionsProps) {
  return (
    <div className="study-actions" role="group" aria-label="Ações do card">
      <p className="study-actions__hint">
        Atalhos: Espaço ou F para virar, → ou N para próxima, Esc para sair.
      </p>
      <div className="study-actions__buttons">
        <Button
          type="button"
          variant="secondary"
          onClick={onFlip}
          aria-label={isFlipped ? 'Virar card e mostrar pergunta' : 'Virar card e mostrar resposta'}
        >
          Virar
        </Button>
        <Button
          type="button"
          onClick={onNext}
          aria-label="Ir para o próximo card"
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
