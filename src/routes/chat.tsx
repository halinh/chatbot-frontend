import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getToken } from '../lib/authStore'
import { SessionSidebar } from '../features/chat/SessionSidebar'

export const Route = createFileRoute('/chat')({
  beforeLoad: () => {
    if (!getToken()) throw redirect({ to: '/login' })
  },
  component: ChatLayout,
})

function ChatLayout() {
  return (
    <div className="flex h-screen bg-background">
      <SessionSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
