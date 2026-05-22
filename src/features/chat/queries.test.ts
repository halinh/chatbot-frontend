import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React from 'react'
import { useSessions, useMessages } from './queries'
import * as fetchClientModule from '../../lib/fetchClient'

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useSessions', () => {
  it('fetches from /chat/sessions', async () => {
    const mock = [{ session_id: 'abc', message_count: 2, last_message_at: '2024-01-01T00:00:00Z' }]
    vi.spyOn(fetchClientModule, 'apiFetch').mockResolvedValue(mock)
    const { result } = renderHook(() => useSessions(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mock)
    expect(fetchClientModule.apiFetch).toHaveBeenCalledWith('/chat/sessions')
  })
})

describe('useMessages', () => {
  it('fetches from /chat/sessions/{id}/messages', async () => {
    const mock = [{ id: 'm1', session_id: 's1', user_id: 'u1', role: 'user', content: 'Hi', created_at: '2024-01-01T00:00:00Z' }]
    vi.spyOn(fetchClientModule, 'apiFetch').mockResolvedValue(mock)
    const { result } = renderHook(() => useMessages('s1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mock)
    expect(fetchClientModule.apiFetch).toHaveBeenCalledWith('/chat/sessions/s1/messages')
  })
})
