import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { ProductsIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

type Product = {
  id: number
  nombre: string
  categoria?: string | null
  laboratorio?: string | null
  marca?: string | null
  estado?: boolean | null
}

function ProductsPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    clearStoredUser()

    navigate('/login', {
      replace: true,
    })
  }

  function handleNew() {
  }

  function handleImport() {
  }

  function handleExport() {
  }

  const columns: DataTableColumn<Product>[] = [
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
      key: 'categoria',
      header: 'Categoria',
      render: (product) => product.categoria || '-',
    },
    {
      key: 'laboratorio',
      header: 'Laboratorio',
      render: (product) => product.laboratorio || '-',
    },
    {
      key: 'marca',
      header: 'Marca',
      render: (product) => product.marca || '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (product) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            product.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ]

  const products: Product[] = []

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
          title="Productos"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
          actions={(
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Exportar
              </button>

              <button
                onClick={handleImport}
                className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Importar
              </button>
            </>
          )}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de productos"
            columns={columns}
            data={products}
            loadingMessage="Cargando productos..."
            emptyMessage="No existen productos registrados"
          />
        </main>
      </div>
    </div>
  )
}

export default ProductsPage
