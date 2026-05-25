import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { InventoryIcon, ExportIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { useProductosPorVencer } from '../../features/inventario/hooks/useProductosPorVencer'
import type { Lote } from '../../features/inventario/types/lote.types'

type FiltroVencimiento = 'TODOS' | 'VENCIDOS' | '30' | '60' | '90'

function ProductosPorVencerPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [filtro, setFiltro] = useState<FiltroVencimiento>('30')

  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    lotes,
    resumen,
    isLoading,
    error,
    refetch: refetchProductosPorVencer,
  } = useProductosPorVencer(90)

  const lotesFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return lotes

    return lotes.filter((lote) => {
      const dias = getDiasParaVencer(lote.fecha_vencimiento)

      if (dias === null) return false

      if (filtro === 'VENCIDOS') return dias < 0

      const limite = Number(filtro)

      return dias >= 0 && dias <= limite
    })
  }, [lotes, filtro])

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
    console.log('Exportar productos por vencer')
  }

  function handleView(lote: Lote) {
    console.log('ver lote/producto por vencer', lote)
    setOpenMenuId(null)
  }

  function handleBloquear(lote: Lote) {
    console.log('bloquear lote', lote)
    setOpenMenuId(null)
  }

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function formatDate(value?: string | null) {
    if (!value) return '-'

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function getDiasParaVencer(value?: string | null) {
    if (!value) return null

    const hoy = new Date()
    const vencimiento = new Date(`${value}T00:00:00`)

    hoy.setHours(0, 0, 0, 0)

    if (Number.isNaN(vencimiento.getTime())) return null

    const diff = vencimiento.getTime() - hoy.getTime()

    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function getEstadoVencimiento(lote: Lote) {
    const dias = getDiasParaVencer(lote.fecha_vencimiento)

    if (dias === null) {
      return {
        label: 'Sin fecha',
        className: 'bg-slate-100 text-slate-700',
      }
    }

    if (dias < 0) {
      return {
        label: `Vencido hace ${Math.abs(dias)} días`,
        className: 'bg-red-100 text-red-700',
      }
    }

    if (dias === 0) {
      return {
        label: 'Vence hoy',
        className: 'bg-red-100 text-red-700',
      }
    }

    if (dias <= 30) {
      return {
        label: `Vence en ${dias} días`,
        className: 'bg-orange-100 text-orange-700',
      }
    }

    if (dias <= 60) {
      return {
        label: `Vence en ${dias} días`,
        className: 'bg-yellow-100 text-yellow-700',
      }
    }

    if (dias <= 90) {
      return {
        label: `Vence en ${dias} días`,
        className: 'bg-blue-100 text-blue-700',
      }
    }

    return {
      label: `Vence en ${dias} días`,
      className: 'bg-emerald-100 text-emerald-700',
    }
  }

  function getEstadoLoteClass(estado: Lote['estado_lote']) {
    if (estado === 'DISPONIBLE') return 'bg-emerald-50 text-emerald-700'
    if (estado === 'AGOTADO') return 'bg-slate-100 text-slate-700'
    if (estado === 'VENCIDO') return 'bg-red-50 text-red-700'
    if (estado === 'BLOQUEADO') return 'bg-orange-50 text-orange-700'

    return 'bg-red-50 text-red-700'
  }

  function getComprobante(lote: Lote) {
    const compra = lote.compra

    if (!compra) return '-'

    const serie = compra.serie || ''
    const numero = compra.numero || ''

    if (!serie && !numero) return `Compra #${compra.id}`

    return `${serie}${serie && numero ? '-' : ''}${numero}`
  }

  const columns: DataTableColumn<Lote>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'producto_id',
      header: 'Producto',
      render: (lote) => (
        <div>
          <p className="font-medium text-slate-800">
            {lote.producto?.nombre_comercial || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {lote.producto?.nombre_generico || 'Sin nombre genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'producto_id',
      header: 'Código',
      render: (lote) => (
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {lote.producto?.codigo || '-'}
        </span>
      ),
    },
    {
      key: 'sucursal_id',
      header: 'Sucursal',
      render: (lote) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {lote.sucursal?.nombre || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {lote.sucursal?.codigo || 'Sin código'}
          </p>
        </div>
      ),
    },
    {
      key: 'numero_lote',
      header: 'Lote',
      render: (lote) => (
        <span className="rounded bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
          {lote.numero_lote}
        </span>
      ),
    },
    {
      key: 'cantidad_actual',
      header: 'Stock lote',
      render: (lote) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            lote.cantidad_actual <= 0
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {lote.cantidad_actual}
        </span>
      ),
    },
    {
      key: 'fecha_vencimiento',
      header: 'Vencimiento',
      render: (lote) => {
        const estado = getEstadoVencimiento(lote)

        return (
          <div>
            <p className="text-sm font-medium text-slate-800">
              {formatDate(lote.fecha_vencimiento)}
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${estado.className}`}
            >
              {estado.label}
            </span>
          </div>
        )
      },
    },
    {
      key: 'estado_lote',
      header: 'Estado lote',
      render: (lote) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getEstadoLoteClass(
            lote.estado_lote,
          )}`}
        >
          {lote.estado_lote}
        </span>
      ),
    },
    {
      key: 'costo_unitario',
      header: 'Costo',
      render: (lote) => (
        <span className="text-sm text-slate-700">
          {formatMoney(lote.costo_unitario)}
        </span>
      ),
    },
    {
      key: 'compra_id',
      header: 'Compra',
      render: (lote) => (
        <div>
          <p className="text-sm text-slate-700">{getComprobante(lote)}</p>

          <p className="text-xs text-slate-500">
            {formatDate(lote.compra?.fecha_emision)}
          </p>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (lote) => (
        <div ref={actionsMenuRef} className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              setOpenMenuId((current) =>
                current === lote.id ? null : lote.id,
              )
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Acciones"
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {openMenuId === lote.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-36 rounded border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => handleView(lote)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver detalle
              </button>

              {lote.estado_lote === 'DISPONIBLE' && (
                <button
                  type="button"
                  onClick={() => handleBloquear(lote)}
                  className="block w-full px-3 py-1.5 text-left text-xs text-orange-600 transition hover:bg-orange-50"
                >
                  Bloquear
                </button>
              )}
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
          title="Productos por vencer"
          buttonText="Actualizar"
          onButtonClick={refetchProductosPorVencer}
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
              label="Vencidos"
              value={resumen.vencidos}
              className="border-red-100 bg-red-50 text-red-700"
            />

            <SummaryCard
              label="Vence en 30 días"
              value={resumen.vence_30}
              className="border-orange-100 bg-orange-50 text-orange-700"
            />

            <SummaryCard
              label="Vence en 60 días"
              value={resumen.vence_60}
              className="border-yellow-100 bg-yellow-50 text-yellow-700"
            />

            <SummaryCard
              label="Vence en 90 días"
              value={resumen.vence_90}
              className="border-blue-100 bg-blue-50 text-blue-700"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <FilterButton
              label="Todos"
              active={filtro === 'TODOS'}
              onClick={() => setFiltro('TODOS')}
            />

            <FilterButton
              label="Vencidos"
              active={filtro === 'VENCIDOS'}
              onClick={() => setFiltro('VENCIDOS')}
            />

            <FilterButton
              label="Próx. 30 días"
              active={filtro === '30'}
              onClick={() => setFiltro('30')}
            />

            <FilterButton
              label="Próx. 60 días"
              active={filtro === '60'}
              onClick={() => setFiltro('60')}
            />

            <FilterButton
              label="Próx. 90 días"
              active={filtro === '90'}
              onClick={() => setFiltro('90')}
            />
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <DataTable
            title="Listado de productos por vencer"
            columns={columns}
            data={lotesFiltrados}
            isLoading={isLoading}
            loadingMessage="Cargando productos por vencer..."
            emptyMessage="No existen productos por vencer"
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

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )
}

export default ProductosPorVencerPage