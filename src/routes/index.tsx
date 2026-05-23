import { createFileRoute, redirect } from '@tanstack/react-router'
import { getToken } from '../lib/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (getToken()) throw redirect({ to: '/chat' })
    throw redirect({ to: '/login' })
  },
  component: () => null,
})
