import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, clearToken } from './authStore'

describe('authStore', () => {
  beforeEach(() => { localStorage.clear() })

  it('returns null when no token stored', () => {
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves a token', () => {
    setToken('my-jwt')
    expect(getToken()).toBe('my-jwt')
  })

  it('clears a stored token', () => {
    setToken('my-jwt')
    clearToken()
    expect(getToken()).toBeNull()
  })

  it('overwrites existing token', () => {
    setToken('old')
    setToken('new')
    expect(getToken()).toBe('new')
  })
})
