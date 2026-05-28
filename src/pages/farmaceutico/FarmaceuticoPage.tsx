import { RoleShell } from '../components/RoleShell'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import FarmaceuticoSidebar from '../../components/layout/siderbars/FarmaceuticoSidebar'
import { useState } from 'react'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useNavigate } from 'react-router-dom'

export function FarmaceuticoPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <FarmaceuticoSidebar collapsed={collapsed} />

      <div className="flex-1">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="px-8 py-8">
          <RoleShell
            title="Panel Farmaceutico"
            subtitle="Vista base para rol_id = 6."
            user={user}
          />
        </main>
      </div>
    </div>
  )
}
