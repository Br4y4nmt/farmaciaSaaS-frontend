import { Navigate, Outlet } from 'react-router-dom'
import { getStoredUser } from '../../features/auth/utils/authStorage'

type ProtectedRouteProps = {
  allowedRoles: number[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.rol_id)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
