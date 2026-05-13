import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { RoleShell } from '../components/RoleShell'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

export function SuperAdminPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar />
      <div className="flex-1">
        <SuperAdminHeader user={user} onLogout={handleLogout} />

        <main className="px-8 py-8">
          <RoleShell
            title="Panel Super Administrador"
            subtitle="Vista base para rol_id = 1."
            user={user}
          />
        </main>
      </div>
    </div>
  )
}
