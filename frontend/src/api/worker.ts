import type { Role, Worker } from '../types/worker';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const mockWorkers: Worker[] = [
  { id: '1', full_name: 'Ana Reyes', email: 'ana@example.com', role: 'baker', status: 'active' },
  { id: '2', full_name: 'Ben Cruz', email: 'ben@example.com', role: 'cashier', status: 'pending' },
];
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong');
  return data;
}

export async function addWorker(body: { full_name: string; email: string; role: Role }) {
  if (MOCK) {
    await wait();
    if (mockWorkers.some((w) => w.email === body.email)) throw new Error('Email already exists.');
    mockWorkers.push({ id: String(Date.now()), ...body, status: 'pending' });
    return {};
  }
  return request('/api/workers', { method: 'POST', body: JSON.stringify(body) });
}

export async function listWorkers(): Promise<Worker[]> {
  if (MOCK) { await wait(); return [...mockWorkers]; }
  return request('/api/workers');
}

export async function resendInvite(id: string) {
  if (MOCK) { await wait(); return {}; }
  return request(`/api/workers/${id}/resend`, { method: 'POST' });
}

export async function validateInvite(token: string) {
  if (MOCK) {
    await wait()
    if (token === 'expired') throw new Error('Link expired')
    return {}
  }
  return request(`/api/invite/${token}`)
}

export async function setPassword(token: string, password: string) {
  if (MOCK) {
    await wait()
    return {}
  }
  return request(`/api/invite/${token}/set-password`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}