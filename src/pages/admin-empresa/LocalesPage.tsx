import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { CreateLocalModal } from '../../features/empresa/components/CreateLocalModal'
import { EditLocalModal } from '../../features/empresa/components/EditLocalModal'
import { useLocales } from '../../features/empresa/hooks/useLocales'
import { useDeleteSucursal } from '../../features/empresa/hooks/useDeleteSucursal'
import type { Sucursal } from '../../features/empresa/types/empresa.types'

import { InventoryIcon } from '../../components/icons'

export function LocalesPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null)

  const { locales, isLoading, error, refetch } = useLocales()
  const { deleteSucursal } = useDeleteSucursal()

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

  async function handleDelete(sucursal: Sucursal) {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el local/sucursal "${sucursal.nombre}"?`,
    )

    if (!confirmDelete) return

    const response = await deleteSucursal(sucursal.id)

    if (!response) return

    refetch()
  }

  const columns: DataTableColumn<Sucursal>[] = [
    {
      key: 'nombre',
      header: 'Local / Sucursal',
      render: (sucursal) => (
        <div>
          <p className="font-medium text-slate-800">{sucursal.nombre}</p>
          <p className="text-xs text-slate-500">
            {sucursal.direccion_comercial ||
              sucursal.direccion_fiscal ||
              'Sin dirección registrada'}
          </p>
        </div>
      ),
    },
    {
      key: 'codigo',
      header: 'Código',
      render: (sucursal) => (
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {sucursal.codigo || '-'}
        </span>
      ),
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
      <AdminEmpresaSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Locales / Sucursales"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<InventoryIcon />}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado sucursales"
            columns={columns}
            data={locales}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando locales..."
            emptyMessage="No existen locales registrados"
          />
        </main>
      </div>

      <CreateLocalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={refetch}
      />

        <EditLocalModal
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

export default LocalesPage