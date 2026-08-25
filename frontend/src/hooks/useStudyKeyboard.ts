import { useEffect } from 'react'

interface UseStudyKeyboardOptions {
  enabled: boolean
  isFlipped: boolean
  onFlip: () => void
  onNext: () => void
  onExit: () => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export function useStudyKeyboard({
  enabled,
  isFlipped,
  onFlip,
  onNext,
  onExit,
}: UseStudyKeyboardOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onExit()
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'n' || event.key === 'N') {
        event.preventDefault()
        onNext()
        return
      }

      if (!isFlipped && (event.key === ' ' || event.key === 'f' || event.key === 'F')) {
        event.preventDefault()
        onFlip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, isFlipped, onFlip, onNext, onExit])
}
