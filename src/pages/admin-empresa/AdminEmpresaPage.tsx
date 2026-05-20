import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoleShell } from '../components/RoleShell'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useWelcomeToast } from '../../components/ui/toast'

export function AdminEmpresaPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  useWelcomeToast()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminEmpresaSidebar collapsed={collapsed} />

      <div className="flex-1">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="px-8 py-8">
          <RoleShell
            title="Panel Administrador Empresa"
            subtitle="Vista base para rol_id = 2."
            user={user}
          />
        </main>
      </div>
    </div>
  )
}