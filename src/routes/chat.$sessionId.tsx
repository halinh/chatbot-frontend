import { createFileRoute } from '@tanstack/react-router'
import { ChatWindow } from '../features/chat/ChatWindow'

export const Route = createFileRoute('/chat/$sessionId')({
  component: ChatSessionPage,
})

function ChatSessionPage() {
  const { sessionId } = Route.useParams()
  return <ChatWindow sessionId={sessionId} />
}
