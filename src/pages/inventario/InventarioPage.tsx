import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function InventarioPage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Inventario"
      subtitle="Vista base para rol_id = 5."
      user={user}
    />
  )
}
