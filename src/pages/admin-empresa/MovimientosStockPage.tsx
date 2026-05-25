import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { InventoryIcon, ExportIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { useMovimientosStock } from '../../features/inventario/hooks/useMovimientosStock'
import type { MovimientoStock } from '../../features/inventario/types/movimientoStock.types'

function MovimientosStockPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    movimientos,
    isLoading,
    error,
    refetch: refetchMovimientos,
  } = useMovimientosStock()

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

  function handleExport() {
    console.log('Exportar movimientos de stock')
  }

  function handleView(movimiento: MovimientoStock) {
    console.log('ver movimiento', movimiento)
    setOpenMenuId(null)
  }

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function formatDateTime(value?: string | null) {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getTipoMovimientoLabel(tipo: MovimientoStock['tipo_movimiento']) {
    const labels: Record<MovimientoStock['tipo_movimiento'], string> = {
      INGRESO_COMPRA: 'Ingreso por compra',
      SALIDA_VENTA: 'Salida por venta',
      AJUSTE_ENTRADA: 'Ajuste de entrada',
      AJUSTE_SALIDA: 'Ajuste de salida',
      DEVOLUCION_CLIENTE: 'Devolución cliente',
      DEVOLUCION_PROVEEDOR: 'Devolución proveedor',
      TRASLADO_ENTRADA: 'Traslado entrada',
      TRASLADO_SALIDA: 'Traslado salida',
      ANULACION_COMPRA: 'Anulación compra',
      ANULACION_VENTA: 'Anulación venta',
    }

    return labels[tipo] || tipo
  }

  function getTipoMovimientoClass(tipo: MovimientoStock['tipo_movimiento']) {
    if (tipo === 'INGRESO_COMPRA') return 'bg-emerald-50 text-emerald-700'
    if (tipo === 'ANULACION_COMPRA') return 'bg-red-50 text-red-700'
    if (tipo === 'SALIDA_VENTA') return 'bg-orange-50 text-orange-700'
    if (tipo.includes('AJUSTE')) return 'bg-blue-50 text-blue-700'
    if (tipo.includes('TRASLADO')) return 'bg-purple-50 text-purple-700'

    return 'bg-slate-100 text-slate-700'
  }

  function getNaturalezaClass(naturaleza: MovimientoStock['naturaleza']) {
    return naturaleza === 'ENTRADA'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700'
  }

  function getCantidadLabel(movimiento: MovimientoStock) {
    const prefix = movimiento.naturaleza === 'ENTRADA' ? '+' : '-'
    return `${prefix}${movimiento.cantidad}`
  }

  function getUsuarioNombre(movimiento: MovimientoStock) {
    if (!movimiento.usuario) return '-'

    return `${movimiento.usuario.nombres} ${
      movimiento.usuario.apellidos || ''
    }`.trim()
  }

  function getReferencia(movimiento: MovimientoStock) {
    if (!movimiento.referencia_id) return movimiento.referencia_tipo

    return `${movimiento.referencia_tipo} #${movimiento.referencia_id}`
  }

  const columns: DataTableColumn<MovimientoStock>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'created_at',
      header: 'Fecha',
      render: (movimiento) => (
        <span className="text-sm text-slate-700">
          {formatDateTime(movimiento.created_at)}
        </span>
      ),
    },
    {
      key: 'producto_id',
      header: 'Producto',
      render: (movimiento) => (
        <div>
          <p className="font-medium text-slate-800">
            {movimiento.producto?.nombre_comercial || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {movimiento.producto?.nombre_generico || 'Sin nombre genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'producto_id',
      header: 'Código',
      render: (movimiento) => (
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {movimiento.producto?.codigo || '-'}
        </span>
      ),
    },
    {
      key: 'sucursal_id',
      header: 'Sucursal',
      render: (movimiento) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {movimiento.sucursal?.nombre || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {movimiento.sucursal?.codigo || 'Sin código'}
          </p>
        </div>
      ),
    },
    {
      key: 'lote_id',
      header: 'Lote',
      render: (movimiento) => (
        <span className="rounded bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
          {movimiento.lote?.numero_lote || '-'}
        </span>
      ),
    },
    {
      key: 'tipo_movimiento',
      header: 'Movimiento',
      render: (movimiento) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getTipoMovimientoClass(
            movimiento.tipo_movimiento,
          )}`}
        >
          {getTipoMovimientoLabel(movimiento.tipo_movimiento)}
        </span>
      ),
    },
    {
      key: 'naturaleza',
      header: 'Tipo',
      render: (movimiento) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getNaturalezaClass(
            movimiento.naturaleza,
          )}`}
        >
          {movimiento.naturaleza}
        </span>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      render: (movimiento) => (
        <span
          className={`font-semibold ${
            movimiento.naturaleza === 'ENTRADA'
              ? 'text-emerald-700'
              : 'text-red-700'
          }`}
        >
          {getCantidadLabel(movimiento)}
        </span>
      ),
    },
    {
      key: 'stock_anterior',
      header: 'Stock',
      render: (movimiento) => (
        <div className="text-sm text-slate-700">
          <span>{movimiento.stock_anterior}</span>
          <span className="mx-1 text-slate-400">→</span>
          <span className="font-semibold text-slate-900">
            {movimiento.stock_nuevo}
          </span>
        </div>
      ),
    },
    {
      key: 'costo_unitario',
      header: 'Costo',
      render: (movimiento) => (
        <span className="text-sm text-slate-700">
          {formatMoney(movimiento.costo_unitario)}
        </span>
      ),
    },
    {
      key: 'referencia_tipo',
      header: 'Referencia',
      render: (movimiento) => (
        <div>
          <p className="text-sm text-slate-700">{getReferencia(movimiento)}</p>

          <p className="text-xs text-slate-500">
            {movimiento.motivo || 'Sin motivo'}
          </p>
        </div>
      ),
    },
    {
      key: 'usuario_id',
      header: 'Usuario',
      render: (movimiento) => (
        <div>
          <p className="text-sm text-slate-700">
            {getUsuarioNombre(movimiento)}
          </p>

          <p className="text-xs text-slate-500">
            {movimiento.usuario?.correo || ''}
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (movimiento) => (
        <div ref={actionsMenuRef} className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              setOpenMenuId((current) =>
                current === movimiento.id ? null : movimiento.id,
              )
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Acciones"
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {openMenuId === movimiento.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-36 rounded border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => handleView(movimiento)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver detalle
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
          title="Movimientos de Stock"
          buttonText="Actualizar"
          onButtonClick={refetchMovimientos}
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
          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <DataTable
            title="Historial de movimientos"
            columns={columns}
            data={movimientos}
            isLoading={isLoading}
            loadingMessage="Cargando movimientos..."
            emptyMessage="No existen movimientos registrados"
          />
        </main>
      </div>
    </div>
  )
}

export default MovimientosStockPage