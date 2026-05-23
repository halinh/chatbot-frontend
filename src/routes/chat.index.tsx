import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/chat/')({
  component: ChatIndexPage,
})

function ChatIndexPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-muted-foreground">Select a conversation or start a new one</p>
      <Button onClick={() => navigate({ to: '/chat/$sessionId', params: { sessionId: crypto.randomUUID() } })}>
        New chat
      </Button>
    </div>
  )
}
