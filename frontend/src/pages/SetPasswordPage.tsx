import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { validateInvite, setPassword } from '../api/worker'

export default function SetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()

  const [valid, setValid] = useState<boolean | null>(() => (token ? null : false))
  const [password, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    validateInvite(token)
      .then(() => {
        if (!cancelled) setValid(true)
      })
      .catch(() => {
        if (!cancelled) setValid(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await setPassword(token, password)
      navigate('/?activated=1')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (valid === null) return <p>Checking your link...</p>

  if (!valid) {
    return (
      <div>
        <h2>Link expired or invalid</h2>
        <p>Please ask your admin to resend the invitation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Create your password</h2>
      {error && <p className="error">{error}</p>}

      <label>
        New password
        <input
          type="password"
          value={password}
          onChange={(e) => setPw(e.target.value)}
          required
        />
      </label>

      <label>
        Confirm password
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </label>

      <button disabled={loading}>{loading ? 'Saving...' : 'Set password'}</button>
    </form>
  )
}