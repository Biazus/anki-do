import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

interface StudyLayoutProps {
  title: string
  progressLabel: string
  onExit: () => void
  card: ReactNode
  actions: ReactNode
  extendedPanel: ReactNode
}

export function StudyLayout({
  title,
  progressLabel,
  onExit,
  card,
  actions,
  extendedPanel,
}: StudyLayoutProps) {
  return (
    <div className="study-layout">
      <header className="study-layout__header">
        <h1 className="study-layout__title">{title}</h1>
        <div className="study-layout__meta">
          <span className="study-layout__progress" aria-live="polite">
            {progressLabel}
          </span>
          <Button type="button" variant="secondary" onClick={onExit} aria-label="Sair da sessão">
            Sair
          </Button>
        </div>
      </header>

      <div className="study-layout__body">
        <div className="study-layout__main">
          <div className="study-layout__card-area">{card}</div>
          {actions}
        </div>
        {extendedPanel}
      </div>
    </div>
  )
}
