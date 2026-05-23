import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '../features/auth/RegisterForm'

export const Route = createFileRoute('/register')({
  component: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RegisterForm />
    </div>
  ),
})
