import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { ReportIcon } from '../../components/icons'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useEmpresasUsuariosResumen } from '../../features/empresa/hooks/useEmpresasUsuariosResumen'
import type { EmpresaUsuariosResumen } from '../../features/empresa/types/empresa.types'

import CreateUserModal from '../../features/empresa/components/CreateUserModal'
import ViewUsersModal from '../../features/empresa/components/ViewUsersModal'

export function UsersPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [isViewUsersModalOpen, setIsViewUsersModalOpen] =
    useState(false)

  const [selectedEmpresa, setSelectedEmpresa] =
    useState<EmpresaUsuariosResumen | null>(null)

  const {
    empresas,
    isLoading,
    error,
    refetch
  } = useEmpresasUsuariosResumen()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setSelectedEmpresa(null)
    setIsCreateModalOpen(true)
  }

  function handleCreateUserByEmpresa(
    empresa: EmpresaUsuariosResumen
  ) {
    setSelectedEmpresa(empresa)
    setIsCreateModalOpen(true)
  }

  function handleViewUsers(
    empresa: EmpresaUsuariosResumen
  ) {
    setSelectedEmpresa(empresa)
    setIsViewUsersModalOpen(true)
  }

  const columns: DataTableColumn<EmpresaUsuariosResumen>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },

    {
      key: 'nombre',
      header: 'Empresa',
    },

    {
      key: 'ruc',
      header: 'RUC',
      render: (empresa) => empresa.ruc || '-',
    },

    {
      key: 'plan',
      header: 'Plan',
      render: (empresa) =>
        empresa.plan?.nombre || '-',
    },

    {
      key: 'totalUsuarios',
      header: 'Usuarios',
      render: (empresa) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {empresa.totalUsuarios}
        </span>
      ),
    },

    {
      key: 'estado',
      header: 'Estado',
      render: (empresa) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            empresa.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {empresa.estado
            ? 'Activo'
            : 'Inactivo'}
        </span>
      ),
    },

    {
      key: 'acciones',
      header: 'Acciones',
      render: (empresa) => (
        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() =>
              handleViewUsers(empresa)
            }
            className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          >
            Ver
          </button>

          <button
            type="button"
            onClick={() =>
              handleCreateUserByEmpresa(
                empresa
              )
            }
            className="rounded bg-slate-900 px-3 py-1 text-xs text-white transition hover:bg-slate-800"
          >
            Crear
          </button>

        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">

      <SuperAdminSidebar
        collapsed={collapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Usuarios por Empresa"
          icon={<ReportIcon />}
        />

        <CreateUserModal
          isOpen={isCreateModalOpen}
          empresaId={
            selectedEmpresa?.id ??
            null
          }
          empresaNombre={
            selectedEmpresa?.nombre ??
            ''
          }
          onClose={() => {
            setIsCreateModalOpen(
              false
            )
            setSelectedEmpresa(null)
          }}
          onSuccess={() => {
            setIsCreateModalOpen(
              false
            )

            setSelectedEmpresa(null)

            refetch()
          }}
        />

        <ViewUsersModal
          isOpen={isViewUsersModalOpen}
          empresaNombre={selectedEmpresa?.nombre}
          usuarios={selectedEmpresa?.usuarios || []}
          onClose={() => {
            setIsViewUsersModalOpen(false)
            setSelectedEmpresa(null)
          }}
        />

        <main className="px-8 py-5">

          <DataTable
            title="Usuarios por empresa"
            columns={columns}
            data={empresas}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando empresas..."
            emptyMessage="No existen empresas registradas"
          />

        </main>

      </div>
    </div>
  )
}

export default UsersPage