import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { ExportIcon, InventoryIcon } from '../../components/icons'
import StockPorSucursalModal from '../../features/inventario/components/StockPorSucursalModal'
import { useStockGeneral } from '../../features/inventario/hooks/useStockGeneral'
import LotesPorProductoModal from '../../features/inventario/components/LotesPorProductoModal'
import KardexPorProductoModal from '../../features/inventario/components/KardexPorProductoModal'
import AjustarStockModal from '../../features/inventario/components/AjustarStockModal'
import type {
  StockGeneral,
  EstadoStock,
} from '../../features/inventario/types/inventario.types'
import StockGeneralDetailModal from '../../features/inventario/components/StockGeneralDetailModal'



export function StockGeneralPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const { stock, isLoading, error, refetch } = useStockGeneral()

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [menuCoords, setMenuCoords] = useState<{
    top: number
    left: number
  } | null>(null)

  const [selectedStock, setSelectedStock] = useState<StockGeneral | null>(null)

  const [selectedProductoSucursalId, setSelectedProductoSucursalId] =
  useState<number | null>(null)

  const [selectedProductoLotesId, setSelectedProductoLotesId] =
  useState<number | null>(null)

  const [selectedProductoKardexId, setSelectedProductoKardexId] =
  useState<number | null>(null)

  const [selectedStockAjuste, setSelectedStockAjuste] =
  useState<StockGeneral | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeActionsMenu()
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

  function getStockTotal(item: StockGeneral) {
    return Number(item.stock_total || 0)
  }

  function getStockReservado(item: StockGeneral) {
    return Number(item.stock_reservado || 0)
  }

  function getStockDisponible(item: StockGeneral) {
    if (item.stock_disponible !== undefined && item.stock_disponible !== null) {
      return Number(item.stock_disponible || 0)
    }

    return Math.max(getStockTotal(item) - getStockReservado(item), 0)
  }

  function getEstadoStock(item: StockGeneral): EstadoStock {
    const stockDisponible = getStockDisponible(item)
    const stockMinimo = Number(item.stock_minimo || 0)
    const stockMaximo = Number(item.stock_maximo || 0)

    if (stockDisponible <= 0) return 'AGOTADO'

    if (stockMinimo > 0 && stockDisponible <= stockMinimo * 0.5) {
      return 'CRITICO'
    }

    if (stockMinimo > 0 && stockDisponible <= stockMinimo) {
      return 'BAJO'
    }

    if (stockMaximo > 0 && stockDisponible >= stockMaximo) {
      return 'SOBRESTOCK'
    }

    return 'NORMAL'
  }

  function getEstadoStockLabel(estadoStock: EstadoStock) {
    const labels: Record<EstadoStock, string> = {
      AGOTADO: 'Agotado',
      CRITICO: 'Crítico',
      BAJO: 'Bajo',
      SOBRESTOCK: 'Sobrestock',
      NORMAL: 'Normal',
    }

    return labels[estadoStock]
  }

  function getEstadoStockClass(estadoStock: EstadoStock) {
    const styles: Record<EstadoStock, string> = {
      AGOTADO: 'bg-red-100 text-red-700',
      CRITICO: 'bg-orange-100 text-orange-700',
      BAJO: 'bg-yellow-100 text-yellow-700',
      SOBRESTOCK: 'bg-purple-100 text-purple-700',
      NORMAL: 'bg-green-100 text-green-700',
    }

    return styles[estadoStock]
  }

  function handleExportar() {
    console.log('Exportar stock general')
  }

  function closeActionsMenu() {
    setOpenMenuId(null)
    setMenuCoords(null)
  }

  function handleVerDetalle(item: StockGeneral) {
    setSelectedStock(item)
    closeActionsMenu()
  }

  function handleAjustarStock(item?: StockGeneral) {
  closeActionsMenu()

  if (!item) return

  setSelectedStockAjuste(item)
}

  function handleVerPorSucursal(item: StockGeneral) {
    closeActionsMenu()
    setSelectedProductoSucursalId(item.producto_id)
  }

  function handleVerLotes(item: StockGeneral) {
    closeActionsMenu()
    setSelectedProductoLotesId(item.producto_id)
  }

  function handleVerKardex(item: StockGeneral) {
    closeActionsMenu()
    setSelectedProductoKardexId(item.producto_id)
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
      key: 'categoria',
      header: 'Categoría',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.categoria || '-'}
        </span>
      ),
    },
    {
      key: 'laboratorio',
      header: 'Laboratorio',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.laboratorio || '-'}
        </span>
      ),
    },
    {
      key: 'marca',
      header: 'Marca',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.marca || '-'}
        </span>
      ),
    },
    {
      key: 'stock_total',
      header: 'Stock',
      render: (item) => {
        const stockTotal = getStockTotal(item)
        const stockReservado = getStockReservado(item)
        const stockDisponible = getStockDisponible(item)

        return (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                Total: {stockTotal}
              </span>

              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                Disponible: {stockDisponible}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Reservado: {stockReservado}
            </p>
          </div>
        )
      },
    },
    {
      key: 'unidad_medida',
      header: 'Unidad',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.unidad_medida || '-'}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado stock',
      render: (item) => {
        const estadoStock = getEstadoStock(item)

        return (
          <div className="space-y-1">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoStockClass(
                estadoStock,
              )}`}
            >
              {getEstadoStockLabel(estadoStock)}
            </span>

            <p
              className={`text-[11px] ${
                item.estado ? 'text-slate-500' : 'text-red-500'
              }`}
            >
              {item.estado ? 'Producto activo' : 'Producto inactivo'}
            </p>
          </div>
        )
      },
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (item) => (
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              const current =
                openMenuId === item.producto_id ? null : item.producto_id

              setOpenMenuId(current)

              if (current) {
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect()

                setMenuCoords({
                  top: rect.bottom + window.scrollY,
                  left: rect.right + window.scrollX - 160,
                })
              } else {
                setMenuCoords(null)
              }
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Acciones"
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {openMenuId === item.producto_id &&
            menuCoords &&
            createPortal(
              <div
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: menuCoords.top,
                  left: menuCoords.left,
                }}
                className="z-50 w-40 rounded border border-slate-200 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => handleVerDetalle(item)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Ver
                </button>

                <button
                  type="button"
                  onClick={() => handleVerPorSucursal(item)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Sucursales
                </button>

                <button
                  type="button"
                  onClick={() => handleVerLotes(item)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Lotes
                </button>

                <button
                  type="button"
                  onClick={() => handleVerKardex(item)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Kardex
                </button>

                <button
                  type="button"
                  onClick={() => handleAjustarStock(item)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Ajustar
                </button>
              </div>,
              document.body,
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
          title="Stock General"
          icon={<InventoryIcon />}
          actions={
            <>
              <button
                onClick={handleExportar}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
              >
                <ExportIcon />
                Exportar
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

      <StockGeneralDetailModal
        isOpen={!!selectedStock}
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      <StockPorSucursalModal
      isOpen={!!selectedProductoSucursalId}
      productoId={selectedProductoSucursalId}
      onClose={() => setSelectedProductoSucursalId(null)}
    />

    <LotesPorProductoModal
      isOpen={!!selectedProductoLotesId}
      productoId={selectedProductoLotesId}
      onClose={() => setSelectedProductoLotesId(null)}
    />

    <KardexPorProductoModal
      isOpen={!!selectedProductoKardexId}
      productoId={selectedProductoKardexId}
      onClose={() => setSelectedProductoKardexId(null)}
    />

    <AjustarStockModal
    isOpen={!!selectedStockAjuste}
    stock={selectedStockAjuste}
    onClose={() => setSelectedStockAjuste(null)}
    onSuccess={refetch}
  />
    </div>
  )
}

export default StockGeneralPage