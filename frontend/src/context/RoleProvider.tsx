import { useState, type ReactNode } from 'react'
import { RoleContext, ROLE_ACCESS, STAFF, type StaffUser } from '../types/roles'

export default function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser>(STAFF[0])

  const canAccess = (path: string) => ROLE_ACCESS[user.role].includes(path)

  return (
    <RoleContext.Provider value={{ user, setUser, canAccess }}>
      {children}
    </RoleContext.Provider>
  )
}