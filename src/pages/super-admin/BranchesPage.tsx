import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { CreateBranchModal } from '../../features/empresa/components/CreateBranchModal'
import { useSucursales } from '../../features/empresa/hooks/useSucursales'
import type { Sucursal } from '../../features/empresa/types/empresa.types'
import { EditBranchModal } from '../../features/empresa/components/EditBranchModal'
import { useDeleteSucursal } from '../../features/empresa/hooks/useDeleteSucursal'
import { ReportIcon } from '../../components/icons'


export function BranchesPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)
  const { deleteSucursal } = useDeleteSucursal()

  async function handleDelete(sucursal: Sucursal) {
  const confirmDelete = window.confirm(
    `¿Seguro que deseas eliminar la sucursal "${sucursal.nombre}"?`
    )

    if (!confirmDelete) return

    const response = await deleteSucursal(sucursal.id)

    if (!response) return

    refetch()
  }
  
  const {
    sucursales,
    isLoading,
    error,
    refetch,
  } = useSucursales()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setShowCreateModal(true)
  }
  
  function handleEdit(sucursal: Sucursal) {
  setSelectedSucursal(sucursal)
  setShowEditModal(true)
 }
  const columns: DataTableColumn<Sucursal>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'empresa',
      header: 'Empresa',
      render: (sucursal) => sucursal.empresa?.nombre || '-',
    },
    {
      key: 'nombre',
      header: 'Sucursal',
    },
    {
      key: 'codigo',
      header: 'Código',
      render: (sucursal) => sucursal.codigo || '-',
    },
    {
      key: 'direccion_fiscal',
      header: 'Dirección fiscal',
      render: (sucursal) => sucursal.direccion_fiscal || '-',
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (sucursal) => sucursal.telefono || '-',
    },
    {
      key: 'responsable',
      header: 'Responsable',
      render: (sucursal) => sucursal.responsable || '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (sucursal) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            sucursal.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {sucursal.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (sucursal) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleEdit(sucursal)}
            className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => handleDelete(sucursal)}
            className="rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Sucursales"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ReportIcon />}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de sucursales"
            columns={columns}
            data={sucursales}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando sucursales..."
            emptyMessage="No existen sucursales registradas"
          />
        </main>
      </div>

      <CreateBranchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={refetch}
      />
      <EditBranchModal
        isOpen={showEditModal}
        sucursal={selectedSucursal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedSucursal(null)
        }}
        onUpdated={refetch}
      />
    </div>
  )
}

export default BranchesPage