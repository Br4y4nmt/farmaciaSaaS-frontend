import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { InventoryIcon, ExportIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { useStockCritico } from '../../features/inventario/hooks/useStockCritico'
import type { StockCritico } from '../../features/inventario/types/stockCritico.types'

function StockCriticoPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const {
    stockCritico,
    resumen,
    isLoading,
    error,
    refetch: refetchStockCritico,
  } = useStockCritico()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleExport() {
    console.log('Exportar stock crítico')
  }

  function handleNuevaCompra(item: StockCritico) {
    console.log('Crear compra para reponer producto', item)

    navigate('/admin-empresa/compras')
  }

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function getEstadoStockClass(estado: StockCritico['estado_stock']) {
    if (estado === 'SIN_STOCK') return 'bg-red-100 text-red-700'
    if (estado === 'CRITICO') return 'bg-orange-100 text-orange-700'
    if (estado === 'BAJO') return 'bg-yellow-100 text-yellow-700'

    return 'bg-emerald-100 text-emerald-700'
  }

  function getEstadoStockLabel(estado: StockCritico['estado_stock']) {
    if (estado === 'SIN_STOCK') return 'Sin stock'
    if (estado === 'CRITICO') return 'Crítico'
    if (estado === 'BAJO') return 'Bajo'

    return 'Normal'
  }

  function getPorcentajeStock(item: StockCritico) {
    const minimo = Number(item.stock_minimo || 0)

    if (minimo <= 0) return 0

    return Math.min(Math.round((item.stock_disponible / minimo) * 100), 100)
  }

  const columns: DataTableColumn<StockCritico>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'producto_id',
      header: 'Producto',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">
            {item.producto?.nombre_comercial || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {item.producto?.nombre_generico || 'Sin nombre genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'producto_id',
      header: 'Código',
      render: (item) => (
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {item.producto?.codigo || '-'}
        </span>
      ),
    },
    {
      key: 'sucursal_id',
      header: 'Sucursal',
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {item.sucursal?.nombre || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {item.sucursal?.codigo || 'Sin código'}
          </p>
        </div>
      ),
    },
    {
      key: 'stock_actual',
      header: 'Stock actual',
      render: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.stock_actual <= 0
              ? 'bg-red-100 text-red-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {item.stock_actual}
        </span>
      ),
    },
    {
      key: 'stock_reservado',
      header: 'Reservado',
      render: (item) => (
        <span className="text-sm text-slate-700">{item.stock_reservado}</span>
      ),
    },
    {
      key: 'stock_disponible',
      header: 'Disponible',
      render: (item) => (
        <span className="font-medium text-slate-800">
          {item.stock_disponible}
        </span>
      ),
    },
    {
      key: 'stock_minimo',
      header: 'Stock mínimo',
      render: (item) => (
        <span className="text-sm text-slate-700">{item.stock_minimo}</span>
      ),
    },
    {
      key: 'stock_maximo',
      header: 'Stock máximo',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.stock_maximo || '-'}
        </span>
      ),
    },
    {
      key: 'estado_stock',
      header: 'Nivel',
      render: (item) => {
        const porcentaje = getPorcentajeStock(item)

        return (
          <div className="min-w-[120px]">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getEstadoStockClass(
                item.estado_stock,
              )}`}
            >
              {getEstadoStockLabel(item.estado_stock)}
            </span>

            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
              <div
                className={`h-1.5 rounded-full ${
                  item.estado_stock === 'SIN_STOCK'
                    ? 'bg-red-500'
                    : item.estado_stock === 'CRITICO'
                      ? 'bg-orange-500'
                      : item.estado_stock === 'BAJO'
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                }`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              {porcentaje}% del mínimo
            </p>
          </div>
        )
      },
    },
    {
      key: 'producto_id',
      header: 'Precio compra',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {formatMoney(item.producto?.precio_compra)}
        </span>
      ),
    },
    {
      key: 'producto_id',
      header: 'Acción',
      render: (item) => (
        <button
          type="button"
          onClick={() => handleNuevaCompra(item)}
          className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          Reponer
        </button>
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
          title="Stock Crítico"
          buttonText="Actualizar"
          onButtonClick={refetchStockCritico}
          icon={<InventoryIcon />}
          actions={
            <>
              <button
                onClick={handleExport}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ExportIcon />
                Exportar
              </button>
            </>
          }
        />

        <main className="px-8 py-5">
          <div className="mb-5 grid grid-cols-4 gap-4">
            <SummaryCard
              label="Sin stock"
              value={resumen.sin_stock}
              className="border-red-100 bg-red-50 text-red-700"
            />

            <SummaryCard
              label="Críticos"
              value={resumen.critico}
              className="border-orange-100 bg-orange-50 text-orange-700"
            />

            <SummaryCard
              label="Stock bajo"
              value={resumen.bajo}
              className="border-yellow-100 bg-yellow-50 text-yellow-700"
            />

            <SummaryCard
              label="Total alertas"
              value={resumen.total}
              className="border-slate-200 bg-white text-slate-700"
            />
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <DataTable
            title="Listado de productos con stock crítico"
            columns={columns}
            data={stockCritico}
            isLoading={isLoading}
            loadingMessage="Cargando stock crítico..."
            emptyMessage="No existen productos con stock crítico"
          />
        </main>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  className,
}: {
  label: string
  value: number
  className: string
}) {
  return (
    <div className={`rounded border px-4 py-3 ${className}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}

export default StockCriticoPage