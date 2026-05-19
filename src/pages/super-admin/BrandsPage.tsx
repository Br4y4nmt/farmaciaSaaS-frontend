import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { TableFilterBar } from '../../components/ui/TableFilterBar'
import { ExportIcon, ProductsIcon } from '../../components/icons'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useMarcas } from '../../features/marca/hooks/useMarcas'
import EditMarcaModal from '../../features/marca/components/EditMarcaModal'
import type { Marca } from '../../features/marca/types/marca.types'
import { useDeleteMarca } from '../../features/marca/hooks/useDeleteMarca'
import { showErrorToast, showSuccessToast } from '../../components/ui/toast'
import CreateMarcaModal from '../../features/marca/components/CreateMarcaModal'

function BrandsPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { deleteMarca, isDeleting, deleteError } = useDeleteMarca()

  const {
    marcas,
    isLoading,
    error,
    refetch,
  } = useMarcas(user?.empresa_id)

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setIsCreateModalOpen(true)
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false)
  }

  function handleCreateSuccess() {
    setIsCreateModalOpen(false)
    refetch()
  }

  function handleCloseEditModal() {
  setIsEditModalOpen(false)
  setSelectedMarca(null)
  }

function handleEditSuccess() {
  setIsEditModalOpen(false)
  setSelectedMarca(null)
  refetch()
}
  function handleExport() {}

  function handleEdit(marca: Marca) {
  setSelectedMarca(marca)
  setIsEditModalOpen(true)
}

async function handleDelete(marca: Marca) {
  const confirmDelete = window.confirm(
    `¿Seguro que deseas eliminar la marca "${marca.nombre}"?`
  )

  if (!confirmDelete) return

  const success = await deleteMarca(marca.id)

  if (!success) {
    showErrorToast(
      'No se pudo eliminar la marca',
      deleteError || 'Verifica si la marca tiene productos asociados'
    )
    return
  }

  showSuccessToast(
    'Marca eliminada correctamente',
    'La lista de marcas fue actualizada'
  )

  refetch()
}

  const columns = [
    {
      key: 'codigo',
      header: 'Código',
      render: (marca: Marca) => marca.codigo || '-',
    },
    {
      key: 'nombre',
      header: 'Marca',
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (marca: Marca) => marca.descripcion || '-',
    },
    {
      key: 'total_productos',
      header: 'Productos',
      render: (marca: Marca) => marca.total_productos ?? 0,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (marca: Marca) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            marca.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {marca.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (marca: Marca) => (
        <div className="flex items-center gap-2">
        <button
          className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          type="button"
          onClick={() => handleEdit(marca)}
        >
          Editar
        </button>

        <button
          className="rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isDeleting}
          onClick={() => handleDelete(marca)}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
        </div>
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
          title="Marcas"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
          actions={
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
            >
            <ExportIcon />
            
              Exportar
            </button>
          }
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de marcas"
            columns={columns}
            data={marcas}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando marcas..."
            emptyMessage="No existen marcas registradas"
            toolbarContent={<TableFilterBar />}
          />
        </main>
      </div>

      <CreateMarcaModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />
      <EditMarcaModal
        isOpen={isEditModalOpen}
        marca={selectedMarca}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

export default BrandsPage