import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { SecurityIcon } from '../../components/icons'

const usuarios = [
  {
    numero: 1,
    id: 1,
    nombres: 'Juan Carlos',
    apellidos: 'Pérez Ramos',
    correo: 'juan.perez@gmail.com',
    telefono: '987654321',
    rol: 'Farmacéutico',
    sucursal: 'Sucursal Central',
    codigoSucursal: 'SUC001',
    estado: true,
  },
  {
    numero: 2,
    id: 2,
    nombres: 'María Fernanda',
    apellidos: 'López Torres',
    correo: 'maria.lopez@gmail.com',
    telefono: '912345678',
    rol: 'Cajero',
    sucursal: 'Sucursal Norte',
    codigoSucursal: 'SUC002',
    estado: true,
  },
  {
    numero: 3,
    id: 3,
    nombres: 'Carlos Alberto',
    apellidos: 'Ramírez Díaz',
    correo: 'carlos.ramirez@gmail.com',
    telefono: '956789123',
    rol: 'Inventario',
    sucursal: 'Almacén Principal',
    codigoSucursal: 'ALM001',
    estado: false,
  },
  {
    numero: 4,
    id: 4,
    nombres: 'Ana Lucía',
    apellidos: 'Gómez Rojas',
    correo: 'ana.gomez@gmail.com',
    telefono: '999888777',
    rol: 'Gerente',
    sucursal: 'Sucursal Central',
    codigoSucursal: 'SUC001',
    estado: true,
  },
  {
    numero: 5,
    id: 5,
    nombres: 'Luis Miguel',
    apellidos: 'Sánchez Vega',
    correo: 'luis.sanchez@gmail.com',
    telefono: '944555666',
    rol: 'Contador',
    sucursal: 'Oficina Administrativa',
    codigoSucursal: 'ADM001',
    estado: true,
  },
]

type UsuarioMock = (typeof usuarios)[number]

export function UsuariosPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    console.log('Abrir modal crear usuario')
  }

  function handleEdit(usuario: UsuarioMock) {
    console.log('Editar usuario:', usuario)
  }

  function handleDelete(usuario: UsuarioMock) {
    console.log('Eliminar usuario:', usuario)
  }

  const columns: DataTableColumn<UsuarioMock>[] = [
    {
      key: 'numero',
      header: 'N°',
      render: (usuario) => (
        <span className="text-sm font-medium text-slate-600">
          {usuario.numero}
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
          {usuario.rol}
        </span>
      ),
    },
    {
      key: 'sucursal',
      header: 'Local / Sucursal',
      render: (usuario) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {usuario.sucursal}
          </p>
          <p className="text-xs text-slate-500">
            {usuario.codigoSucursal}
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
      render: (usuario) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleEdit(usuario)}
            className="cursor-pointer rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDelete(usuario)}
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

        <main className="px-8 py-5">
          <DataTable
            title="Listado de usuarios"
            columns={columns}
            data={usuarios}
            isLoading={false}
            error={null}
            loadingMessage="Cargando usuarios..."
            emptyMessage="No existen usuarios registrados"
          />
        </main>
      </div>
    </div>
  )
}

export default UsuariosPage