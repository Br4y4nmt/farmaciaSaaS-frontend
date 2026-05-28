import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { useUsuarios } from '../../features/usuarios/hooks/useUsuarios'
import type { Usuario } from '../../features/usuarios/types/usuario.types'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { SecurityIcon } from '../../components/icons'
import CreateUsuarioModal from '../../features/usuarios/components/CreateUsuarioModal'
import { useDeleteUsuario } from '../../features/usuarios/hooks/useDeleteUsuario'
import EditUsuarioModal from '../../features/usuarios/components/EditUsuarioModal'
import { showQuestionAlert, showErrorAlert } from '../../components/ui/alerts'
import { showSuccessToast } from '../../components/ui/toast'


export function UsuariosPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const { usuarios, isLoading, error, refetch } = useUsuarios()
  const { deleteUsuario } = useDeleteUsuario()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setIsCreateOpen(true)
  }

  function handleEdit(usuario: Usuario) {
    setSelectedUsuario(usuario)
    setIsEditOpen(true)
  }

  async function handleDelete(usuario: Usuario) {
    const nombreCompleto = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim()

    const confirmed = await showQuestionAlert({
      title: 'Eliminar usuario',
      text: `¿Seguro que deseas eliminar el usuario "${nombreCompleto || usuario.correo}"?`,
    })

    if (!confirmed) return

    const response = await deleteUsuario(usuario.id)

    if (!response) {
      await showErrorAlert({
        title: 'Error',
        text: 'No se pudo eliminar el usuario.',
      })
      return
    }

    refetch()
    showSuccessToast('Usuario eliminado', 'El usuario ha sido eliminado correctamente.')
  }

  const columns: DataTableColumn<Usuario>[] = [
    {
      key: 'numero',
      header: 'N°',
      render: (usuario) => (
        <span className="text-sm font-medium text-slate-600">
          {usuarios.findIndex((item) => item.id === usuario.id) + 1}
        </span>
      ),
    },
    {
      key: 'usuario',
      header: 'Usuario',
      render: (usuario) => {
        const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`

        return (
          <div>
            <p className="font-medium text-slate-800">{nombreCompleto}</p>
            <p className="text-xs text-slate-500">{usuario.correo}</p>
          </div>
        )
      },
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (usuario) => (
        <span className="text-sm text-slate-700">
          {usuario.telefono || '-'}
        </span>
      ),
    },
    {
      key: 'rol',
      header: 'Rol',
      render: (usuario) => (
        <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          {usuario.rol?.nombre || 'Sin rol'}
        </span>
      ),
    },
    {
      key: 'sucursal',
      header: 'Local / Sucursal',
      render: (usuario) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
          {usuario.sucursal?.nombre || 'Sin sucursal'}
        </p>
        <p className="text-xs text-slate-500">
          {usuario.sucursal?.codigo || '-'}
        </p>
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (usuario) => (
        <span
          className={`rounded px-3 py-1 text-xs font-medium ${
            usuario.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {usuario.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
{
  key: 'acciones',
  header: 'Acciones',
  render: (usuario) => {
    const isAdminEmpresa = usuario.rol?.codigo === 'ADMIN_EMPRESA'

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleEdit(usuario)}
          className="cursor-pointer rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
        >
          Editar
        </button>

        {!isAdminEmpresa && (
          <button
            type="button"
            onClick={() => handleDelete(usuario)}
            className="cursor-pointer rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        )}
      </div>
    )
  },
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
          title="Usuarios"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<SecurityIcon />}
        />

        <CreateUsuarioModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreated={refetch}
        />
        <EditUsuarioModal
          isOpen={isEditOpen}
          usuario={selectedUsuario}
          onClose={() => {
            setIsEditOpen(false)
            setSelectedUsuario(null)
          }}
          onUpdated={refetch}
        />

        <main className="px-8 py-5">
        <DataTable
          title="Listado de usuarios"
          columns={columns}
          data={usuarios}
          isLoading={isLoading}
          error={error}
          loadingMessage="Cargando usuarios..."
          emptyMessage="No existen usuarios registrados"
        />
        </main>
      </div>
    </div>
  )
}

export default UsuariosPage