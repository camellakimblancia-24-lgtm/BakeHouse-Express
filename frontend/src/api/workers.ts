import type { Role } from '../types/roles'

const API_URL = 'http://localhost:3000/api'
export const USE_MOCK = true

export interface Worker {
  id: string
  email: string
  role: Role
  first_name: string
  last_name: string
}

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('baker_auth_token') ?? ''}`,
  }
}

async function readError(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  return body?.message ?? fallback
}

export async function listWorkers(): Promise<Worker[]> {
  const res = await fetch(`${API_URL}/users`,{
    method: 'GET',
    headers: headers()
  })
  if (!res.ok) throw new Error(await readError(res, 'Could not load workers'))
  return res.json()
}


export async function removeWorker(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  if (!res.ok) throw new Error(await readError(res, 'Could not remove worker'))
}