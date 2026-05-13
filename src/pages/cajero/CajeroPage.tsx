import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function CajeroPage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Cajero"
      subtitle="Vista base para rol_id = 4."
      user={user}
    />
  )
}
