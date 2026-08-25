import { Button } from '../ui/Button'

interface ExtendedPanelProps {
  description: string
  isOpen: boolean
  canShow: boolean
  onToggle: () => void
}

export function ExtendedPanel({
  description,
  isOpen,
  canShow,
  onToggle,
}: ExtendedPanelProps) {
  if (!canShow) {
    return null
  }

  return (
    <aside className={`extended-panel ${isOpen ? 'extended-panel--open' : ''}`}>
      <Button
        type="button"
        variant="secondary"
        className="extended-panel__toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="extended-panel-content"
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
