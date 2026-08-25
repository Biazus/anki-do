import type { ReactNode } from 'react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  children?: ReactNode
}

export function ErrorState({
  title = 'Algo deu errado',
  message,
  onRetry,
  children,
}: ErrorStateProps) {
  return (
    <div className="empty-state empty-state--error" role="alert">
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{message}</p>
      {onRetry || children ? (
        <div className="empty-state__action">
          {onRetry ? (
            <Button type="button" onClick={onRetry}>
              Tentar novamente
            </Button>
          ) : null}
          {children}
        </div>
      ) : null}
    </div>
  )
}
