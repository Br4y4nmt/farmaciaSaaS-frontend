import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { ExportIcon, ProductsIcon, ImportIcon } from '../../components/icons'
import { useStockGeneral } from '../../features/inventario/hooks/useStockGeneral'
import type { StockGeneral } from '../../features/inventario/types/inventario.types'

import { InventoryIcon } from '../../components/icons'

export function StockGeneralPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const { stock, isLoading, error } = useStockGeneral()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }
  function handleImportar() {
  console.log('Importar stock')
    }

    function handleIngreso() {
    console.log('Nuevo ingreso de stock')
    }

    function handleSalida() {
    console.log('Nueva salida de stock')
    }

  const columns: DataTableColumn<StockGeneral>[] = [
    {
      key: 'producto',
      header: 'Producto',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">
            {item.nombre_comercial || item.nombre_generico || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {item.nombre_generico || 'Sin nombre genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'codigo',
      header: 'Código',
      render: (item) => (
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {item.codigo || '-'}
        </span>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (item) => item.categoria || '-',
    },
    {
      key: 'laboratorio',
      header: 'Laboratorio',
      render: (item) => item.laboratorio || '-',
    },
    {
      key: 'stock_total',
      header: 'Stock total',
      render: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.stock_total <= 0
              ? 'bg-red-100 text-red-700'
              : item.stock_minimo && item.stock_total <= item.stock_minimo
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}
        >
          {item.stock_total}
        </span>
      ),
    },
    {
      key: 'stock_minimo',
      header: 'Stock mínimo',
      render: (item) => item.stock_minimo ?? '-',
    },
    {
      key: 'unidad_medida',
      header: 'Unidad',
      render: (item) => item.unidad_medida || '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.estado
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.estado ? 'Activo' : 'Inactivo'}
        </span>
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
            title="Stock General"
            icon={<InventoryIcon />}
            actions={
                <>
                <button
                    onClick={handleImportar}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ImportIcon />
                Importar
                </button>

                <button
                    onClick={handleIngreso}
                    className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] font-bold leading-none text-slate-900">
                    +
                    </span>
                    Ingreso
                </button>

                <button
                    onClick={handleSalida}
                    className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
                >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] font-bold leading-none text-slate-900">
                    -
                    </span>
                    Salida
                </button>
                </>
            }
            />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de stock general"
            columns={columns}
            data={stock}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando stock general..."
            emptyMessage="No existe stock registrado"
          />
        </main>
      </div>
    </div>
  )
}

export default StockGeneralPage