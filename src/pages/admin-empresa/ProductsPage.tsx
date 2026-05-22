import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import CreateProductModal from '../../features/producto/components/CreateProductModal'
import EditProductModal from '../../features/producto/components/EditProductModal'
import { ExportIcon, ProductsIcon, ImportIcon } from '../../components/icons'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useProductos } from '../../features/producto/hooks/useProductos'
import { useDeleteProducto } from '../../features/producto/hooks/useDeleteProducto'
import type { Producto } from '../../features/producto/types/producto.types'

function ProductsPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    productos,
    isLoading: isLoadingProductos,
    error: productosError,
    refetch: refetchProductos,
  } = useProductos()

  const {
  eliminarProducto,
  isLoading: isDeletingProducto,
  error: deleteError,
  setError: setDeleteError,
} = useDeleteProducto()


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

  function handleImport() {}

  function handleExport() {}

  function handleView(product: Producto) {
    console.log('ver producto', product)
  }

  function handleEdit(product: Producto) {
    setSelectedProduct(product)
    setOpenEditModal(true)
    setOpenMenuId(null)
  }

async function handleDelete(product: Producto) {
  setOpenMenuId(null)
  setDeleteError(null)

  const confirmDelete = window.confirm(
    `¿Seguro que deseas eliminar el producto "${product.nombre_comercial}"? Esta acción eliminará el producto por completo.`,
  )

  if (!confirmDelete) return

  const deleted = await eliminarProducto(product.id)

  if (!deleted) return

  refetchProductos()
}

  function handleDuplicate(product: Producto) {
  console.log('duplicar producto', product)
  setOpenMenuId(null)
}

  function handleDisable(product: Producto) {
    console.log('inhabilitar producto', product)
    setOpenMenuId(null)
  }

  function handleBarcode(product: Producto) {
    console.log('código de barras', product)
    setOpenMenuId(null)
  }

  function formatMoney(value: number) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  const columns: DataTableColumn<Producto>[] = [
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
      key: 'categoria_id',
      header: 'Categoría',
      render: (product) => product.categoria?.nombre || '-',
    },
    {
      key: 'laboratorio_id',
      header: 'Laboratorio',
      render: (product) => product.laboratorio?.nombre || '-',
    },
    {
      key: 'marca_id',
      header: 'Marca',
      render: (product) => product.marca?.nombre || '-',
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
      key: 'estado',
      header: 'Estado',
      render: (product) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            product.estado
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {product.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
{
  key: 'id',
  header: 'Acciones',
  render: (product) => (
    <div ref={actionsMenuRef} className="relative flex justify-end">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()

          setOpenMenuId((current) =>
            current === product.id ? null : product.id,
          )
        }}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
        title="Acciones"
      >
        <span className="text-lg leading-none">⋮</span>
      </button>

      {openMenuId === product.id && (
        <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-8 z-30 w-35 rounded border border-slate-200 bg-white py-1 shadow-lg"
      >
          <button
            type="button"
            onClick={() => handleEdit(product)}
            className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => handleDelete(product)}
            className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Eliminar
          </button>

          <button
            type="button"
            onClick={() => handleDuplicate(product)}
            className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Duplicar
          </button>

          <button
            type="button"
            onClick={() => handleDisable(product)}
            className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Inhabilitar
          </button>

          <button
            type="button"
            onClick={() => handleBarcode(product)}
            className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Cod. Barras
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
          title="Productos"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
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
          {(productosError || deleteError) && (
          <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
            {productosError || deleteError}
          </div>
        )}

          <DataTable
            title="Listado de productos"
            columns={columns}
            data={productos}
            isLoading={isLoadingProductos}
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
          refetchProductos()
        }}
      />
      <EditProductModal
      isOpen={openEditModal}
      product={selectedProduct}
      onClose={() => {
        setOpenEditModal(false)
        setSelectedProduct(null)
      }}
      onSuccess={() => {
        setOpenEditModal(false)
        setSelectedProduct(null)
        refetchProductos()
      }}
    />
    </div>
  )
}

export default ProductsPage