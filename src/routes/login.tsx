import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '../features/auth/LoginForm'

export const Route = createFileRoute('/login')({
  component: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm />
    </div>
  ),
})
