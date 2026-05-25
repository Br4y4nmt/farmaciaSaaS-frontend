import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { ExportIcon, ImportIcon, ProveedorIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import EditProveedorModal from '../../features/proveedor/components/EditProveedorModal'

import CreateProveedorModal from '../../features/proveedor/components/CreateProveedorModal'
import { useProveedores } from '../../features/proveedor/hooks/useProveedores'
import { useDeleteProveedor } from '../../features/proveedor/hooks/useDeleteProveedor'
import type { Proveedor } from '../../features/proveedor/types/proveedor.types'

function ProveedoresPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)
  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    proveedores,
    isLoading,
    error,
    refetch: refetchProveedores,
  } = useProveedores()

  const {
    eliminarProveedor,
    isLoading: isDeletingProveedor,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteProveedor()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setOpenCreateModal(true)
  }

  function handleImport() {
    console.log('Importar proveedores')
  }

  function handleExport() {
    console.log('Exportar proveedores')
  }

  function handleView(proveedor: Proveedor) {
    console.log('ver proveedor', proveedor)
    setOpenMenuId(null)
  }

  function handleEdit(proveedor: Proveedor) {
    setSelectedProveedor(proveedor)
    setOpenEditModal(true)
    setOpenMenuId(null)
  }

  async function handleDelete(proveedor: Proveedor) {
    setOpenMenuId(null)
    setDeleteError(null)

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el proveedor "${proveedor.razon_social}"?`,
    )

    if (!confirmDelete) return

    const deleted = await eliminarProveedor(proveedor.id)

    if (!deleted) return

    refetchProveedores()
  }

  function handleDisable(proveedor: Proveedor) {
    console.log('inhabilitar proveedor', proveedor)
    setOpenMenuId(null)
  }

  const columns: DataTableColumn<Proveedor>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'numero_documento',
      header: 'Documento',
      render: (proveedor) => (
        <div>
          <p className="font-medium text-slate-800">
            {proveedor.numero_documento || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {proveedor.tipo_documento || 'Sin tipo'}
          </p>
        </div>
      ),
    },
    {
      key: 'razon_social',
      header: 'Proveedor',
      render: (proveedor) => (
        <div>
          <p className="font-medium text-slate-800">
            {proveedor.razon_social}
          </p>

          <p className="text-xs text-slate-500">
            {proveedor.nombre_comercial || 'Sin nombre comercial'}
          </p>
        </div>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (proveedor) => proveedor.telefono || proveedor.celular || '-',
    },
    {
      key: 'correo',
      header: 'Correo',
      render: (proveedor) => proveedor.correo || '-',
    },
    {
      key: 'direccion',
      header: 'Dirección',
      render: (proveedor) => (
        <span className="line-clamp-1 text-sm text-slate-600">
          {proveedor.direccion || '-'}
        </span>
      ),
    },
    {
      key: 'contacto_nombre',
      header: 'Contacto',
      render: (proveedor) => (
        <div>
          <p className="text-sm text-slate-700">
            {proveedor.contacto_nombre || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {proveedor.contacto_telefono || proveedor.contacto_correo || ''}
          </p>
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (proveedor) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            proveedor.estado
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {proveedor.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (proveedor) => (
        <div ref={actionsMenuRef} className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              setOpenMenuId((current) =>
                current === proveedor.id ? null : proveedor.id,
              )
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Acciones"
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {openMenuId === proveedor.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-35 rounded border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => handleView(proveedor)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver
              </button>

              <button
                type="button"
                onClick={() => handleEdit(proveedor)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => handleDelete(proveedor)}
                disabled={isDeletingProveedor}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Eliminar
              </button>

              <button
                type="button"
                onClick={() => handleDisable(proveedor)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Inhabilitar
              </button>
            </div>
          )}
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
          title="Proveedores"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProveedorIcon />}
          actions={
            <>
              <button
                onClick={handleExport}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ExportIcon />
                Exportar
              </button>

              <button
                onClick={handleImport}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ImportIcon />
                Importar
              </button>
            </>
          }
        />

        <main className="px-8 py-5">
          {(error || deleteError) && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error || deleteError}
            </div>
          )}

          <DataTable
            title="Listado de proveedores"
            columns={columns}
            data={proveedores}
            isLoading={isLoading}
            loadingMessage="Cargando proveedores..."
            emptyMessage="No existen proveedores registrados"
          />
        </main>
      </div>

        <CreateProveedorModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => {
            setOpenCreateModal(false)
            refetchProveedores()
        }}
        />

        <EditProveedorModal
          isOpen={openEditModal}
          proveedor={selectedProveedor}
          onClose={() => {
            setOpenEditModal(false)
            setSelectedProveedor(null)
          }}
          onSuccess={() => {
            setOpenEditModal(false)
            setSelectedProveedor(null)
            refetchProveedores()
          }}
        />
    </div>
  )
}

export default ProveedoresPage