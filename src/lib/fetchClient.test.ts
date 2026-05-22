import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch, ApiError } from './fetchClient'
import * as authStore from './authStore'

describe('fetchClient', () => {
  beforeEach(() => {
    vi.spyOn(authStore, 'getToken').mockReturnValue(null)
    vi.spyOn(authStore, 'clearToken').mockImplementation(() => {})
    Object.defineProperty(window, 'location', {
      value: { replace: vi.fn() },
      writable: true,
    })
  })

  afterEach(() => { vi.restoreAllMocks() })

  it('calls fetch with correct base URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', mockFetch)
    await apiFetch('/auth/login', { method: 'POST', body: '{}' })
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/login',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('injects Authorization header when token exists', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue('test-token')
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', mockFetch)
    await apiFetch('/chat/sessions')
    const [, options] = mockFetch.mock.calls[0]
    expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer test-token')
  })

  it('does not include Authorization when no token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    vi.stubGlobal('fetch', mockFetch)
    await apiFetch('/auth/login', { method: 'POST', body: '{}' })
    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers).not.toHaveProperty('Authorization')
  })

  it('throws ApiError on non-2xx response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'Not found' })
    vi.stubGlobal('fetch', mockFetch)
    await expect(apiFetch('/missing')).rejects.toBeInstanceOf(ApiError)
  })

  it('clears token and redirects on 401', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue('expired')
    const clearSpy = vi.spyOn(authStore, 'clearToken')
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'Unauthorized' })
    vi.stubGlobal('fetch', mockFetch)
    await expect(apiFetch('/protected')).rejects.toBeInstanceOf(ApiError)
    expect(clearSpy).toHaveBeenCalled()
    expect(window.location.replace).toHaveBeenCalledWith('/login')
  })
})
