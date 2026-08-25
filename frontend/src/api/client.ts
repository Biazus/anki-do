const API_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  const headers = new Headers(options?.headers)
  if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new ApiError(0, 'Erro de rede. Verifique se o backend está rodando.')
  }

  if (!response.ok) {
    let detail: unknown

    try {
      detail = await response.json()
    } catch {
      detail = undefined
    }

    const message = formatErrorMessage(detail, response.statusText)
    throw new ApiError(response.status, message, detail)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function formatErrorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === 'string') {
    return detail
  }

  if (detail && typeof detail === 'object' && 'detail' in detail) {
    const value = (detail as { detail: unknown }).detail

    if (typeof value === 'string') {
      return value
    }
  }

  return fallback || 'Erro inesperado'
}

export { API_URL }
