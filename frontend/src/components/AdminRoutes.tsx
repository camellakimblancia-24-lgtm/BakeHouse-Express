import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '../types/roles'

export default function AdminRoutes() {
  const { canAccess } = useRole()
  if (!canAccess('/admin')) return <Navigate to="/" replace />
  return <Outlet />;
}