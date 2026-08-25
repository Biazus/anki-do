import { Button } from '../ui/Button'

interface ExtendedPanelProps {
  description: string
  isFlipped: boolean
  isOpen: boolean
  canShow: boolean
  onToggle: () => void
}

export function ExtendedPanel({
  description,
  isFlipped,
  isOpen,
  canShow,
  onToggle,
}: ExtendedPanelProps) {
  if (!isFlipped || !canShow) {
    return null
  }

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
        aria-expanded={isOpen}
        aria-controls="extended-panel-content"
        aria-label={isOpen ? 'Ocultar descrição extendida' : 'Mostrar descrição extendida'}
      >
        {isOpen ? 'Ocultar detalhes' : 'Mostrar detalhes'}
      </Button>

      {isOpen ? (
        <div id="extended-panel-content" className="extended-panel__content">
          {description}
        </div>
      ) : null}
    </aside>
  )
}
