import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { DEFAULT_ROUTE, ROLE_LABELS, useRole, type Role } from '../../types/roles'
import AuthShell from './AuthShell'

const inputClass =
  'w-full rounded-full bg-white px-5 py-3 text-sm text-brown ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-brown/40'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useRole()
  const message = (location.state as { message?: string } | null)?.message
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      const role: Role = user.role in ROLE_LABELS ? user.role : 'cashier'
      const initials = user.fullName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
      setUser({
        id: email.trim(),
        email: email.trim(),
        name: user.fullName,
        initials,
        role,
        status: 'active',
      })
      navigate(DEFAULT_ROUTE[role])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect email or password.')
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Log in" subtitle="Use the email your manager invited and the password you set.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brown px-6 py-3 text-sm font-semibold text-cream transition hover:bg-brown/90 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  )
}