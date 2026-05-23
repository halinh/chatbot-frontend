import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setToken } from '../../lib/authStore'
import { apiFetch, ApiError, type TokenResponse } from '../../lib/fetchClient'

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await apiFetch<TokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(data.access_token)
      await navigate({ to: '/chat' })
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401
        ? 'Invalid email or password'
        : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="sr-only">Email</label>
        <Input id="email" type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <label htmlFor="password" className="sr-only">Password</label>
        <Input id="password" type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link to="/register" className="text-primary underline-offset-4 hover:underline">Register</Link>
      </p>
    </div>
  )
}
