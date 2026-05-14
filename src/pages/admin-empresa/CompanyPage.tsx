import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import CreateCompanyModal from '../../features/empresa/components/CreateCompanyModal'
import EditCompanyModal from '../../features/empresa/components/EditCompanyModal'
import { useEmpresas } from '../../features/empresa/hooks/useEmpresas'
import type { Empresa } from '../../features/empresa/types/empresa.types'

export function CompanyPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null)
  const { empresas, isLoading, error, refetch } = useEmpresas()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleEdit(company: Empresa) {
    setEditingCompany(company)
    setIsEditModalOpen(true)
  }

  function handleNew() {
    setIsCreateModalOpen(true)
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

        {/* HEADER */}
        <div className="w-full bg-white px-8 py-2.5 shadow-slate-100">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="text-slate-400">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M4 20a8 8 0 0116 0" />
                </svg>
              </div>

              <h1 className="text-sm font-normal text-slate-400">
                Empresas
              </h1>
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

        {/* CREATE MODAL */}
        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            refetch()
          }}
        />

        {/* EDIT MODAL */}
        <EditCompanyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingCompany(null)
          }}
          initialData={editingCompany ? {
            nombre: editingCompany.nombre,
            ruc: editingCompany.ruc,
            direccion: editingCompany.direccion,
            telefono: editingCompany.telefono,
            correo: editingCompany.correo,
            estado: editingCompany.estado,
          } : undefined}
          companyId={editingCompany?.id}
          onSuccess={() => {
            setIsEditModalOpen(false)
            setEditingCompany(null)
            refetch()
          }}
        />

        {/* TABLE */}
        <main className="px-8 py-4">
          <div className="w-full">
            <div className="overflow-x-auto rounded-lg border border-slate-100">

              <div className="bg-slate-900 px-6 py-4">
                <h2 className="text-xl font-medium text-white">
                  Listado de empresas
                </h2>
              </div>

              <table className="w-full bg-white">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">#</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">Correo</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">RUC</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-normal text-slate-900">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                        Cargando empresas...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : empresas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                        No hay empresas registradas
                      </td>
                    </tr>
                  ) : (
                    empresas.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.id}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.nombre}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.correo || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.telefono || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.ruc || '-'}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {company.estado ? 'Activo' : 'Inactivo'}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(company)}
                              className="btn btn-xs btn-info waves-effect"
                            >
                              Editar
                            </button>
                            {/* Eliminado: botón de eliminar removido por decisión del producto */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}