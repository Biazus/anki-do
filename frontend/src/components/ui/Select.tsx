import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  id: string
  options: SelectOption[]
  placeholder?: string
  error?: string | null
}

export function Select({
  label,
  id,
  options,
  placeholder,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" aria-invalid={error ? true : undefined} {...props}>
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}
