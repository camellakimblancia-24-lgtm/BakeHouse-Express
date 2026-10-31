import type { Role } from '../types/roles'
import { listWorkers, USE_MOCK } from './workers'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export interface AuthUser {
  fullName: string
  role: Role
}

async function readError(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  return body?.message ?? fallback
}

export async function setPassword(token: string, password: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return
  }
  const res = await fetch(`${API_URL}/auth/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })
  if (!res.ok) throw new Error(await readError(res, 'This link is invalid or has expired.'))
}

export async function login(email: string, password: string): Promise<AuthUser> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const workers = await listWorkers()
    const worker = workers.find((w) => w.email.toLowerCase() === email.trim().toLowerCase())
    if (!worker || password.length < 8) throw new Error('Incorrect email or password.')
    return { fullName: worker.fullName, role: worker.role }
  }
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await readError(res, 'Incorrect email or password.'))
  const data = await res.json()
  localStorage.setItem('token', data.token)
  return data.user
}