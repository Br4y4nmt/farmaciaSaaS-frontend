import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { TableFilterBar } from '../../components/ui/TableFilterBar'
import { ProductsIcon } from '../../components/icons'
import { CreateCategoryModal, EditCategoryModal } from '../../features/categoria'
import type { Categoria as CategoriaApi } from '../../features/categoria'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useCategorias, useDeleteCategoria } from '../../features/categoria'

type Category = {
  id: number
  nombre: string
  categoriaPadre?: string | null
  descripcion?: string | null
  productos?: number | null
  estado?: boolean | null
  categoria: CategoriaApi
}

function CategoriesPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoriaApi | null>(null)
  const { deleteCategoria } = useDeleteCategoria()
  const {
    categorias,
    isLoading,
    error,
    refetch,
  } = useCategorias(user?.empresa_id)

  function handleLogout() {
    clearStoredUser()

    navigate('/login', {
      replace: true,
    })
  }

  function handleNew() {
    setIsCreateModalOpen(true)
  }

  function handleExport() {
  }

  function handleEdit(category: CategoriaApi) {
    setEditingCategory(category)
    setIsEditModalOpen(true)
  }

  async function handleDelete(category: Category) {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar la categoria "${category.nombre}"?`
    )

    if (!confirmDelete) return

    const response = await deleteCategoria(category.id)

    if (!response) return

    refetch()
  }

  const columns: DataTableColumn<Category>[] = [
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
      key: 'categoriaPadre',
      header: 'Categoria padre',
      render: (category) => category.categoriaPadre || '-',
    },
    {
      key: 'descripcion',
      header: 'Descripcion',
      render: (category) => category.descripcion || '-',
    },
    {
      key: 'productos',
      header: 'Productos',
      render: (category) => category.productos ?? 0,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (category) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            category.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {category.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
            type="button"
            onClick={() => handleEdit(category.categoria)}
          >
            Editar
          </button>
          <button
            className="rounded bg-red-600 px-3 py-1 text-xs text-white transition hover:bg-red-700"
            type="button"
            onClick={() => handleDelete(category)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const categories: Category[] = categorias.map((categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    categoriaPadre: categoria.categoria_padre?.nombre || null,
    descripcion: categoria.descripcion ?? null,
    productos: 0,
    estado: categoria.estado ?? true,
    categoria,
  }))

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
          title="Categorias"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ProductsIcon />}
          actions={
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
          }
        />

        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            refetch()
          }}
        />

        <EditCategoryModal
          isOpen={isEditModalOpen}
          category={editingCategory}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingCategory(null)
          }}
          onUpdated={refetch}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de categorías"
            columns={columns}
            data={categories}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando categorias..."
            emptyMessage="No existen categorias registradas"
            toolbarContent={<TableFilterBar />}
          />
        </main>
      </div>
    </div>
  )
}

export default CategoriesPage
