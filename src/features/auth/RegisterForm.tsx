import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setToken } from '../../lib/authStore'
import { apiFetch, ApiError, type TokenResponse } from '../../lib/fetchClient'

export function RegisterForm() {
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
      const data = await apiFetch<TokenResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(data.access_token)
      await navigate({ to: '/chat' })
    } catch (err) {
      setError(err instanceof ApiError && err.status === 409
        ? 'Email already registered'
        : 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="sr-only">Email</label>
        <Input id="email" type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <label htmlFor="password" className="sr-only">Password</label>
        <Input id="password" type="password" placeholder="Password (min 8 characters)" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
