import { createContext, useContext } from 'react'

export type Role = 'head_manager' | 'baker' | 'cashier'

export interface StaffUser {
  name: string
  initials: string
  role: Role
}

export const ROLE_LABELS: Record<Role, string> = {
  head_manager: 'Head Manager',
  baker: 'Baker',
  cashier: 'Cashier',
}

export const ROLE_ACCESS: Record<Role, string[]> = {
  head_manager: ['/pantry', '/recipes', '/counter', '/logs'],
  baker: ['/pantry', '/recipes'],
  cashier: ['/counter'],
}

export const DEFAULT_ROUTE: Record<Role, string> = {
  head_manager: '/pantry',
  baker: '/recipes',
  cashier: '/counter',
}

export const STAFF: StaffUser[] = [
  { name: 'Kim Blancia', initials: 'KB', role: 'head_manager' },
  { name: 'Chrisciel Catedrilla', initials: 'CC', role: 'baker' },
  { name: 'Chloe Talaman', initials: 'CT', role: 'cashier' },
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