import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWebSocket } from './useWebSocket'
import * as authStore from '../../lib/authStore'
import { queryClient } from '../../lib/queryClient'

class MockWebSocket {
  static OPEN = 1
  readyState = MockWebSocket.OPEN
  onmessage: ((e: { data: string }) => void) | null = null
  onerror: (() => void) | null = null
  url: string
  sent: string[] = []
  closed = false
  constructor(url: string) { this.url = url }
  send(data: string) { this.sent.push(data) }
  close() { this.closed = true }
}

let mockWs: MockWebSocket

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.spyOn(authStore, 'getToken').mockReturnValue('test-token')
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined)
    // vi.fn() must wrap a regular function (not arrow) to be constructable with `new`
    const mockCtor = vi.fn(function (url: string) {
      mockWs = new MockWebSocket(url)
      return mockWs
    }) as unknown as typeof WebSocket & { OPEN: number }
    mockCtor.OPEN = 1
    vi.stubGlobal('WebSocket', mockCtor)
  })

  afterEach(() => { vi.restoreAllMocks() })

  it('opens WebSocket with correct URL', () => {
    renderHook(() => useWebSocket('sess-1'))
    expect(WebSocket).toHaveBeenCalledWith(
      'ws://localhost:8000/ws/chat?token=test-token&session_id=sess-1'
    )
  })

  it('accumulates chunk messages into streamingContent', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => {
      mockWs.onmessage?.({ data: JSON.stringify({ type: 'chunk', content: 'Hello' }) })
      mockWs.onmessage?.({ data: JSON.stringify({ type: 'chunk', content: ' world' }) })
    })
    expect(result.current.streamingContent).toBe('Hello world')
  })

  it('clears content and invalidates queries on done', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => {
      mockWs.onmessage?.({ data: JSON.stringify({ type: 'chunk', content: 'Hi' }) })
    })
    act(() => {
      mockWs.onmessage?.({ data: JSON.stringify({ type: 'done', session_id: 'sess-1', message_id: 'm1' }) })
    })
    expect(result.current.streamingContent).toBe('')
    expect(result.current.isStreaming).toBe(false)
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['sessions'] })
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['messages', 'sess-1'] })
  })

  it('sets error on error message', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => {
      mockWs.onmessage?.({ data: JSON.stringify({ type: 'error', message: 'oops' }) })
    })
    expect(result.current.error).toBe('oops')
    expect(result.current.isStreaming).toBe(false)
  })

  it('clears isConnecting and sets error on connection failure', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => { mockWs.onerror?.() })
    expect(result.current.isConnecting).toBe(false)
    expect(result.current.error).toBe('WebSocket connection error')
    expect(result.current.isStreaming).toBe(false)
  })

  it('sendMessage sends JSON and sets isStreaming', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => { result.current.sendMessage('Hello') })
    expect(mockWs.sent).toEqual([JSON.stringify({ content: 'Hello', model: 'llama3.2' })])
    expect(result.current.isStreaming).toBe(true)
  })

  it('sendMessage uses custom model when provided', () => {
    const { result } = renderHook(() => useWebSocket('sess-1'))
    act(() => { result.current.sendMessage('Hello', 'mistral') })
    expect(mockWs.sent).toEqual([JSON.stringify({ content: 'Hello', model: 'mistral' })])
  })

  it('closes WebSocket on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket('sess-1'))
    unmount()
    expect(mockWs.closed).toBe(true)
  })
})
