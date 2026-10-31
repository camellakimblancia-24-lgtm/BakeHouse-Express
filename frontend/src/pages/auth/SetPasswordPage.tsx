import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setPassword as submitPassword } from '../../api/auth'
import AuthShell from './AuthShell'

const inputClass =
  'w-full rounded-full bg-white px-5 py-3 text-sm text-brown ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-brown/40'

export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await submitPassword(token ?? '', password)
      navigate('/login', { state: { message: 'Password set! Log in with your email and new password.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Invitation link not valid"
        subtitle="This link is missing its token. Open the link from your invitation email, or ask your manager to send a new one."
      />
    )
  }

  return (
    <AuthShell title="Set your password" subtitle="Choose a password only you know. Nobody else will see it.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
        />
        <input
          type="password"
          className={inputClass}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
        />
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-brown px-6 py-3 text-sm font-semibold text-cream transition hover:bg-brown/90 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Confirm account'}
        </button>
      </form>
    </AuthShell>
  )
}