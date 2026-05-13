import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'

export function AdminEmpresaPage() {
  const user = useStoredUser()

  return (
    <RoleShell
      title="Panel Administrador Empresa"
      subtitle="Vista base para rol_id = 2."
      user={user}
    />
  )
}
