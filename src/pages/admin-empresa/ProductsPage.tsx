import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import CreateProductModal from '../../features/producto/components/CreateProductModal'
import { ExportIcon, ProductsIcon, ImportIcon } from '../../components/icons'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

type Product = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_comercial: string
  nombre_generico?: string | null
  categoria?: string | null
  laboratorio?: string | null
  marca?: string | null
  precio_venta: number
  stock_minimo: number
  stock_maximo: number
  acciones?: null
}

function ProductsPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)


  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setOpenCreateModal(true)
  }

  function handleImport() {}

  function handleExport() {}

  function handleView(product: Product) {
    console.log('ver producto', product)
  }

  function handleEdit(product: Product) {
    console.log('editar producto', product)
  }

  function handleDelete(product: Product) {
    console.log('eliminar producto', product)
  }

  function formatMoney(value: number) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'codigo',
      header: 'Código',
      render: (product) => product.codigo || product.codigo_barras || '-',
    },
    {
      key: 'nombre_comercial',
      header: 'Producto',
      render: (product) => (
        <div>
          <p className="font-medium text-slate-800">
            {product.nombre_comercial}
          </p>
          <p className="text-xs text-slate-500">
            {product.nombre_generico || 'Sin nombre genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (product) => product.categoria || '-',
    },
    {
      key: 'laboratorio',
      header: 'Laboratorio',
      render: (product) => product.laboratorio || '-',
    },
    {
      key: 'precio_venta',
      header: 'Precio venta',
      render: (product) => formatMoney(product.precio_venta),
    },
    {
      key: 'stock_minimo',
      header: 'Stock',
      render: (product) => (
        <span className="text-sm text-slate-700">
          Min: {product.stock_minimo} / Max: {product.stock_maximo}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(product)}
            className="rounded-md bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
            title="Ver"
          >
            👁
          </button>

          <button
            onClick={() => handleEdit(product)}
            className="rounded-md bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
            title="Editar"
          >
            ✏️
          </button>

          <button
            onClick={() => handleDelete(product)}
            className="rounded-md bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
            title="Eliminar"
          >
            🗑
          </button>
        </div>
      ),
    },
  ]

  const products: Product[] = []

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
          title="Productos"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
          actions={
            <>
              <button
                onClick={handleExport}
                className="cursor-pointer flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ExportIcon />
                Exportar
              </button>

              <button
                onClick={handleImport}
                className="cursor-pointer flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ImportIcon />
                Importar
              </button>
            </>
          }
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
      <CreateProductModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => {
          setOpenCreateModal(false)

          // luego aquí recargarás productos:
          // fetchProducts()
        }}
      />
    </div>
  )
}

export default ProductsPage