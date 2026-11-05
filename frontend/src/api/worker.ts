import type { Role, Worker } from '../types/worker';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const WORKERS_KEY = 'bakehouse_workers';

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function readMockWorkers(): Worker[] {
  try {
    const raw = localStorage.getItem(WORKERS_KEY);
    return raw ? JSON.parse(raw) as Worker[] : [];
  } catch {
    return [];
  }
}

function writeMockWorkers(workers: Worker[]) {
  localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('bakehouse_auth_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong');
  return data;
}

export async function addWorker(body: { full_name: string; email: string; password: string; role: Role }) {
  if (MOCK) {
    await wait();
    const mockWorkers = readMockWorkers();
    if (mockWorkers.some((w) => w.email === body.email)) throw new Error('Email already exists.');
    const { password: _password, ...worker } = body;
    const nextWorkers = [...mockWorkers, { id: String(Date.now()), ...worker, status: 'active' }];
    writeMockWorkers(nextWorkers);
    return {};
  }
  return request('/api/workers', { method: 'POST', body: JSON.stringify(body) });
}

export async function listWorkers(): Promise<Worker[]> {
  if (MOCK) { await wait(); return readMockWorkers(); }
  return request('/api/workers');
}

export async function resendInvite(id: string) {
  if (MOCK) { await wait(); return {}; }
  return request(`/api/workers/${id}/resend`, { method: 'POST' });
}

export async function removeWorker(id: string) {
  if (MOCK) {
    await wait();
    const mockWorkers = readMockWorkers();
    const workerIndex = mockWorkers.findIndex((worker) => worker.id === id);
    if (workerIndex === -1) throw new Error('Worker not found.');
    writeMockWorkers(mockWorkers.filter((worker) => worker.id !== id));
    return {};
  }
  return request(`/api/admin/workers/${encodeURIComponent(id)}`, { method: 'DELETE' });
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