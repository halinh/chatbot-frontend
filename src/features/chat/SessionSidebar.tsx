import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSessions } from './queries'
import { clearToken } from '../../lib/authStore'

export function SessionSidebar() {
  const { data: sessions = [] } = useSessions()
  const navigate = useNavigate()

  async function handleNewChat() {
    await navigate({ to: '/chat/$sessionId', params: { sessionId: crypto.randomUUID() } })
  }

  async function handleSignOut() {
    clearToken()
    await navigate({ to: '/login' })
  }

  return (
    <aside className="w-64 border-r flex flex-col bg-muted/30">
      <div className="p-4">
        <Button onClick={handleNewChat} className="w-full">New chat</Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
          )}
          {sessions.map((session) => (
            <Link
              key={session.session_id}
              to="/chat/$sessionId"
              params={{ sessionId: session.session_id }}
              className="flex flex-col w-full rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              activeProps={{ className: 'bg-accent text-accent-foreground' }}
            >
              <span className="font-medium truncate">Chat {session.session_id.slice(0, 8)}</span>
              <span className="text-xs text-muted-foreground">
                {session.message_count} message{session.message_count !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <Button variant="outline" onClick={handleSignOut} className="w-full">Sign out</Button>
      </div>
    </aside>
  )
}
