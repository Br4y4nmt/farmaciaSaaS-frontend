import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function ContadorPage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Contador"
      subtitle="Vista base para rol_id = 7."
      user={user}
    />
  )
}
