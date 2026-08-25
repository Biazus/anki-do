import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string | null
}

export function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" aria-invalid={error ? true : undefined} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
