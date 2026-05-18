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

import CreateCompanyModal from '../../features/empresa/components/CreateCompanyModal'
import EditCompanyModal from '../../features/empresa/components/EditCompanyModal'

import { useEmpresas } from '../../features/empresa/hooks/useEmpresas'
import type { Empresa } from '../../features/empresa/types/empresa.types'

function CompanyPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [editingCompany, setEditingCompany] =
    useState<Empresa | null>(null)

  const {
    empresas,
    isLoading,
    error,
    refetch,
  } = useEmpresas()

  function handleLogout() {
    clearStoredUser()

    navigate('/login', {
      replace: true,
    })
  }

  function handleNew() {
    setIsCreateModalOpen(true)
  }

  function handleEdit(company: Empresa) {
    setEditingCompany(company)
    setIsEditModalOpen(true)
  }

  const columns: DataTableColumn<Empresa>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },

    {
      key: 'nombre',
      header: 'Nombre',
    },

    {
      key: 'correo',
      header: 'Correo',
      render: (company) => company.correo || '-',
    },

    {
      key: 'telefono',
      header: 'Teléfono',
      render: (company) => company.telefono || '-',
    },

    {
      key: 'ruc',
      header: 'RUC',
      render: (company) => company.ruc || '-',
    },

    {
      key: 'estado',
      header: 'Estado',
      render: (company) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            company.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {company.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },

    {
      key: 'acciones',
      header: 'Acciones',
      render: (company) => (
        <button
          onClick={() => handleEdit(company)}
          className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
        >
          Editar
        </button>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar collapsed={collapsed} />

      <div className="flex flex-1 flex-col min-w-0">
        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Empresas"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ReportIcon />}
        />

        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() =>
            setIsCreateModalOpen(false)
          }
          onSuccess={() => {
            setIsCreateModalOpen(false)
            refetch()
          }}
        />

        <EditCompanyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingCompany(null)
          }}
          initialData={
            editingCompany
              ? {
                  nombre: editingCompany.nombre,
                  ruc: editingCompany.ruc,
                  direccion:
                    editingCompany.direccion,
                  telefono:
                    editingCompany.telefono,
                  correo:
                    editingCompany.correo,
                  estado:
                    editingCompany.estado,
                }
              : undefined
          }
          companyId={editingCompany?.id}
          onSuccess={() => {
            setIsEditModalOpen(false)
            setEditingCompany(null)
            refetch()
          }}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de empresas"
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

export default CompanyPage