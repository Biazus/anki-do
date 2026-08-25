import { Button } from '../ui/Button'

interface StudyActionsProps {
  isFlipped: boolean
  onFlip: () => void
  onNext: () => void
}

export function StudyActions({ isFlipped, onFlip, onNext }: StudyActionsProps) {
  return (
    <div className="study-actions">
      <Button
        type="button"
        variant="secondary"
        onClick={onFlip}
        disabled={isFlipped}
        aria-label="Virar card"
      >
        Virar
      </Button>
      <Button type="button" onClick={onNext} aria-label="Próximo card">
        Próxima
      </Button>
    </div>
  )
}
