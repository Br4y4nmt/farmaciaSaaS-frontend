import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function FarmaceuticoPage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Farmaceutico"
      subtitle="Vista base para rol_id = 6."
      user={user}
    />
  )
}
