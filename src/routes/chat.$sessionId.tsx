import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$sessionId')({
  component: ChatSessionPage,
})

function ChatSessionPage() {
  const { sessionId } = Route.useParams()
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Chat window for {sessionId}</p>
    </div>
  )
}
