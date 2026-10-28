import { createContext, useContext } from 'react'

export type Role = 'head_manager' | 'baker' | 'cashier'

export interface StaffUser {
  id: string
  email: string
  name: string
  role: Role
  status: 'active' | 'inactive'
  initials: string
}

export const ROLE_LABELS: Record<Role, string> = {
  head_manager: 'Head Manager',
  baker: 'Baker',
  cashier: 'Cashier',
}

export const ROLE_ACCESS: Record<Role, string[]> = {
  head_manager: ['/pantry', '/recipes', '/counter', '/logs','/admin'],
  baker: ['/pantry', '/recipes'],
  cashier: ['/counter'],
}

export const DEFAULT_ROUTE: Record<Role, string> = {
  head_manager: '/pantry',
  baker: '/recipes',
  cashier: '/counter',
}

export const STAFF: StaffUser[] = [
  { id: "1", email: "kimblanci@example.com", name: 'Kim Blancia', role: 'head_manager', status: "active", initials: 'KB' },
  { id: "2", email: "chrisciel@example.com", name: 'Chrisciel Catedrilla', role: 'baker', status: "active", initials: 'CC', },
  { id: "3", email: "chloe@example.com", name: 'Chloe Talaman', role: 'cashier', status: "inactive", initials: 'CT' },
]

interface RoleContextValue {
  user: StaffUser
  setUser: (user: StaffUser) => void
  canAccess: (path: string) => boolean
}

export const RoleContext = createContext<RoleContextValue | null>(null)

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used inside RoleProvider')
  return ctx
}