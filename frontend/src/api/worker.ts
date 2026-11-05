import type { Worker } from '../api/workers';
import type { Role } from '../types/roles';

const BASE = 'http://localhost:3000';

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

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('baker_auth_token')}`,
  }
}

export async function addWorker(
  body: {
    email: string;
    password: string;
    role: Role
    first_name: string;
    last_name: string;
  }
): Promise<Worker> {
  return request('/api/users', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body)
  });
}