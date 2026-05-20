import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { TableFilterBar } from '../../components/ui/TableFilterBar'
import { ProductsIcon, ExportIcon } from '../../components/icons'
import { showErrorToast } from '../../components/ui/toast'
import CreateLaboratoryModal from '../../features/laboratorio/components/CreateLaboratoryModal'
import EditLaboratoryModal from '../../features/laboratorio/components/EditLaboratoryModal'
import type { Laboratorio } from '../../features/laboratorio/types/laboratorio.types'
import { useLaboratorios } from '../../features/laboratorio/hooks/useLaboratorios'
import { useDeleteLaboratorio } from '../../features/laboratorio/hooks/useDeleteLaboratorio'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

function LaboratoriesPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLaboratory, setEditingLaboratory] =
    useState<Laboratorio | null>(null)

  const { laboratorios, isLoading, error, refetch } = useLaboratorios()
  const { deleteLaboratorio, error: deleteError } = useDeleteLaboratorio()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setIsCreateModalOpen(true)
  }

  function handleExport() {}

  function handleEdit(laboratory: Laboratorio) {
    setEditingLaboratory(laboratory)
    setIsEditModalOpen(true)
  }

  async function handleDelete(laboratory: Laboratorio) {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el laboratorio "${laboratory.nombre}"?`
    )

    if (!confirmDelete) return

    const response = await deleteLaboratorio(laboratory.id)

    if (!response) {
      showErrorToast(
        'No se pudo eliminar el laboratorio',
        deleteError || 'Verifica los datos e intenta nuevamente'
      )
      return
    }

    refetch()
  }

  const columns: DataTableColumn<Laboratorio>[] = [
    {
      key: 'codigo',
      header: 'Código',
      render: (lab) => lab.codigo || '-',
    },
    {
      key: 'nombre',
      header: 'Laboratorio',
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (lab) => lab.descripcion || '-',
    },
    {
      key: 'total_productos',
      header: 'Productos',
      render: (lab) => lab.total_productos ?? 0,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (lab) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            lab.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {lab.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (lab) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(lab)}
            className="cursor-pointer rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDelete(lab)}
            className="cursor-pointer rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminEmpresaSidebar collapsed={collapsed} />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Laboratorios"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
          actions={
            <button
              type="button"
              onClick={handleExport}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
            >
              <ExportIcon />
              Exportar
            </button>
          }
        />

        <CreateLaboratoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            refetch()
          }}
        />

        <EditLaboratoryModal
          isOpen={isEditModalOpen}
          laboratory={editingLaboratory}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingLaboratory(null)
          }}
          onUpdated={refetch}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de laboratorios"
            columns={columns}
            data={laboratorios}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando laboratorios..."
            emptyMessage="No existen laboratorios registrados"
            toolbarContent={<TableFilterBar />}
          />
        </main>
      </div>
    </div>
  )
}

export default LaboratoriesPage