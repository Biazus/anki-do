interface CharCounterProps {
  current: number
  max: number
}

export function CharCounter({ current, max }: CharCounterProps) {
  const ratio = current / max
  const isNearLimit = ratio >= 0.9
  const isAtLimit = current >= max

  const className = [
    'char-counter',
    isNearLimit ? 'char-counter--warning' : '',
    isAtLimit ? 'char-counter--limit' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={className} aria-live="polite">
      {current}/{max}
    </span>
  )
}
