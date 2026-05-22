import { useState, useEffect, useRef, useCallback } from 'react'
import { getToken } from '../../lib/authStore'
import { queryClient } from '../../lib/queryClient'

interface WSChunk { type: 'chunk'; content: string }
interface WSDone { type: 'done'; session_id: string; message_id: string }
interface WSError { type: 'error'; message: string }
type WSMessage = WSChunk | WSDone | WSError

export function useWebSocket(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const [streamingContent, setStreamingContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat?token=${token}&session_id=${sessionId}`
    )
    wsRef.current = ws

    ws.onmessage = (event) => {
      const msg: WSMessage = JSON.parse(event.data)
      if (msg.type === 'chunk') {
        setStreamingContent((prev) => prev + msg.content)
      } else if (msg.type === 'done') {
        setStreamingContent('')
        setIsStreaming(false)
        queryClient.invalidateQueries({ queryKey: ['sessions'] })
        queryClient.invalidateQueries({ queryKey: ['messages', sessionId] })
      } else if (msg.type === 'error') {
        setError(msg.message)
        setIsStreaming(false)
      }
    }

    ws.onerror = () => {
      setError('WebSocket connection error')
      setIsStreaming(false)
    }

    return () => { ws.close() }
  }, [sessionId])

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    setError(null)
    setIsStreaming(true)
    wsRef.current.send(JSON.stringify({ content, model: 'llama3.2' }))
  }, [])

  return { sendMessage, streamingContent, isStreaming, error }
}
