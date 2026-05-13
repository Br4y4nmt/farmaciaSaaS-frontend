import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function GerentePage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Gerente"
      subtitle="Vista base para rol_id = 3."
      user={user}
    />
  )
}
