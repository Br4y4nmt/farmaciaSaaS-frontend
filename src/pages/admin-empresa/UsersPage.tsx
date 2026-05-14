import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

export function UsersPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar collapsed={collapsed} />
      <div className="flex-1">
        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="px-8 py-8">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
              <p className="mt-1 text-sm text-slate-500">Administra los usuarios del sistema</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-slate-600">Contenido del módulo de usuarios</p>
              {/* Aquí irá el contenido del módulo de usuarios */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
