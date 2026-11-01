import type { Role } from './roles'

export type { Role } from './roles'
export type WorkerStatus = 'pending' | 'active'

export interface Worker {
  id: string
  full_name: string
  email: string
  role: Role
  status: WorkerStatus
}