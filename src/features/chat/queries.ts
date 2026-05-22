import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/fetchClient'

export interface Session {
  session_id: string
  message_count: number
  last_message_at: string
}

export interface Message {
  id: string
  session_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiFetch<Session[]>('/chat/sessions'),
  })
}

export function useMessages(sessionId: string) {
  return useQuery({
    queryKey: ['messages', sessionId],
    queryFn: () => apiFetch<Message[]>(`/chat/sessions/${sessionId}/messages`),
    placeholderData: (prev) => prev,
  })
}
