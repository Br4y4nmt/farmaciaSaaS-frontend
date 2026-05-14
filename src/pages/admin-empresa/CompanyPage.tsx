import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

type Company = {
  id: number
  email: string
  nombre: string
  perfil: string
  apiToken: string
  establecimiento: string
}

export function CompanyPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const companies: Company[] = [
    {
      id: 1,
      email: 'empresa1@gmail.com',
      nombre: 'EMPRESA DEMO 1',
      perfil: 'Administrador',
      apiToken: 'nPJhhXbyRsMrGsyWZxhJ7TC9d74tDGkXou9o5Wu55wSOhmT38',
      establecimiento: 'Almacén Lima',
    },
    {
      id: 2,
      email: 'empresa2@gmail.com',
      nombre: 'EMPRESA DEMO 2',
      perfil: 'Administrador',
      apiToken: 'f7cYjhiDPUwuBvCI5SkwFQ9dg03zxwwmr2qHBofhuWXfYBpgV',
      establecimiento: 'Almacén Lima',
    },
  ]

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleEdit(companyId: number) {
    console.log('Editar empresa:', companyId)
  }

  function handleDelete(companyId: number) {
    console.log('Eliminar empresa:', companyId)
  }

  function handleNew() {
    console.log('Crear nueva empresa')
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 min-w-0">
        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Header de página - fuera del main para ocupar todo el ancho */}
        <div className="w-full bg-white px-8 py-2.5  shadow-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-slate-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M4 20a8 8 0 0116 0" />
                </svg>
              </div>
              <h1 className="text-sm font-normal text-slate-400">Empresas</h1>
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2.5 py-2 text-[13px] font-normal text-white transition hover:bg-slate-800"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Nuevo
            </button>
          </div>
        </div>

        <main className="px-8 py-4">
          <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <div className="rounded-t-none bg-slate-900 px-6 py-4">
                <h2 className="text-xl font-medium text-white">Listado de empresas</h2>
              </div>

              <table className="w-full bg-white">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">#</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Email</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Nombre</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Perfil</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Api Token</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Establecimiento</th>
                    <th className="bg-white px-6 py-3 text-left text-sm font-normal text-slate-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50">
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.id}</td>
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.email}</td>
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.nombre}</td>
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.perfil}</td>
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.apiToken}</td>
                      <td className="bg-white px-6 py-4 text-sm text-slate-700">{company.establecimiento}</td>
                      <td className="bg-white px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(company.id)}
                            className="btn btn-xs btn-info waves-effect"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="btn btn-xs btn-danger waves-effect"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}