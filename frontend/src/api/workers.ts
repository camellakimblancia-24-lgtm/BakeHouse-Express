import type { Role } from '../types/roles'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
export const USE_MOCK = true

export interface Worker {
  id: string
  fullName: string
  email: string
  role: Role
  status: 'pending' | 'active'
}

export interface InviteInput {
  fullName: string
  email: string
  role: Role
}

let mockWorkers: Worker[] = [
  { id: '1', fullName: 'Kim Blancia', email: 'kim@bakehouse.com', role: 'head_manager', status: 'active' },
]

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
  }
}

async function readError(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  return body?.message ?? fallback
}

export async function listWorkers(): Promise<Worker[]> {
  if (USE_MOCK) return [...mockWorkers]
  const res = await fetch(`${API_URL}/workers`, { headers: headers() })
  if (!res.ok) throw new Error(await readError(res, 'Could not load staff'))
  return res.json()
}

export async function inviteWorker(input: InviteInput): Promise<Worker> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (mockWorkers.some((w) => w.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error('A worker with this email already exists')
    }
    const worker: Worker = { id: crypto.randomUUID(), ...input, status: 'pending' }
    mockWorkers = [worker, ...mockWorkers]
    return worker
  }
  const res = await fetch(`${API_URL}/workers/invite`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readError(res, 'Could not send the invitation'))
  return res.json()
}