import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getToken } from '../lib/authStore'

export const Route = createFileRoute('/chat')({
  beforeLoad: () => {
    if (!getToken()) throw redirect({ to: '/login' })
  },
  component: ChatLayout,
})

function ChatLayout() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r p-4">
        <p className="text-sm text-muted-foreground">Sidebar (Task 9)</p>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
