import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { useNavigate } from 'react-router-dom'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

export function AdminEmpresaPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <RoleShell
        title="Panel Administrador Empresa"
        subtitle="Vista base para rol_id = 2."
        user={user}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="btn btn-xs btn-danger"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
