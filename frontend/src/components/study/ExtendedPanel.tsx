import { Button } from '../ui/Button'

const EMPTY_MESSAGE = 'Não existem detalhes extras para este card.'

interface ExtendedPanelProps {
  description: string
  hasExtended: boolean
  isFlipped: boolean
  isOpen: boolean
  onToggle: () => void
}

export function ExtendedPanel({
  description,
  hasExtended,
  isFlipped,
  isOpen,
  onToggle,
}: ExtendedPanelProps) {
  return (
    <aside
      className={`extended-panel ${isOpen ? 'extended-panel--open' : ''}`}
      aria-label="Descrição extendida"
    >
      <Button
        type="button"
        variant="secondary"
        className="extended-panel__toggle"
        onClick={onToggle}
        disabled={!isFlipped}
        aria-expanded={isOpen}
        aria-controls="extended-panel-content"
        aria-label={
          isOpen ? 'Ocultar descrição extendida' : 'Mostrar descrição extendida'
        }
        title={!isFlipped ? 'Vire o card para ver os detalhes' : undefined}
      >
        {isOpen ? 'Ocultar detalhes' : 'Mostrar detalhes'}
      </Button>

      {isOpen ? (
        <div id="extended-panel-content" className="extended-panel__content">
          {hasExtended ? (
            description
          ) : (
            <p className="extended-panel__empty">{EMPTY_MESSAGE}</p>
          )}
        </div>
      ) : null}
    </aside>
  )
}
