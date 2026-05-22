import { getToken, clearToken } from './authStore'

const BASE_URL = 'http://localhost:8000'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
      window.location.replace('/login')
    }
    const body = await response.text()
    throw new ApiError(response.status, body)
  }

  return response.json() as Promise<T>
}
