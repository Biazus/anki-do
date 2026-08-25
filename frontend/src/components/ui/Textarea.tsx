import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  id: string
  error?: string | null
}

export function Textarea({ label, id, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} className="textarea" aria-invalid={error ? true : undefined} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
