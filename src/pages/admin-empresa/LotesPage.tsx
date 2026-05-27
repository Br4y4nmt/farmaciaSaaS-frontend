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

import { useLotes } from '../../features/inventario/hooks/useLotes'
import type { Lote } from '../../features/inventario/types/lote.types'
import LoteDetailModal from '../../features/inventario/components/LoteDetailModal'

type FiltroVencimiento = '' | '30' | '60' | '90' | 'VENCIDO'

function LotesPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null)

  const [search, setSearch] = useState('')
  const [sucursalFilter, setSucursalFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [vencimientoFilter, setVencimientoFilter] =
    useState<FiltroVencimiento>('')

  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    lotes,
    isLoading,
    error,
    refetch: refetchLotes,
  } = useLotes()

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
    console.log('Exportar lotes')
  }

  function handleView(lote: Lote) {
    setSelectedLote(lote)
    setOpenMenuId(null)
  }

  function handleBloquear(lote: Lote) {
    console.log('bloquear lote', lote)
    setOpenMenuId(null)
  }

  function handleDesbloquear(lote: Lote) {
    console.log('desbloquear lote', lote)
    setOpenMenuId(null)
  }

  function handleVerKardex(lote: Lote) {
    setOpenMenuId(null)

    navigate(
      `/admin-empresa/inventario/movimientos-kardex?producto_id=${lote.producto_id}&lote_id=${lote.id}`,
    )
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

    if (dias <= 90) {
      return {
        label: `Vence en ${dias} días`,
        className: 'bg-yellow-100 text-yellow-700',
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

  function getValorStock(lote: Lote) {
    return Number(lote.cantidad_actual || 0) * Number(lote.costo_unitario || 0)
  }

  function getCantidadVendida(lote: Lote) {
    return Math.max(
      Number(lote.cantidad_inicial || 0) - Number(lote.cantidad_actual || 0),
      0,
    )
  }

  const sucursalesOptions = useMemo(() => {
    const map = new Map<number, Lote>()

    lotes.forEach((lote) => {
      if (lote.sucursal_id && !map.has(Number(lote.sucursal_id))) {
        map.set(Number(lote.sucursal_id), lote)
      }
    })

    return Array.from(map.values())
  }, [lotes])

  const lotesFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()

    return lotes.filter((lote) => {
      const dias = getDiasParaVencer(lote.fecha_vencimiento)

      const matchSearch =
        !term ||
        lote.numero_lote?.toLowerCase().includes(term) ||
        lote.producto?.nombre_comercial?.toLowerCase().includes(term) ||
        lote.producto?.nombre_generico?.toLowerCase().includes(term) ||
        lote.producto?.codigo?.toLowerCase().includes(term) ||
        lote.sucursal?.nombre?.toLowerCase().includes(term) ||
        getComprobante(lote).toLowerCase().includes(term)

      const matchSucursal =
        !sucursalFilter || String(lote.sucursal_id) === sucursalFilter

      const matchEstado = !estadoFilter || lote.estado_lote === estadoFilter

      let matchVencimiento = true

      if (vencimientoFilter === 'VENCIDO') {
        matchVencimiento = dias !== null && dias < 0
      }

      if (vencimientoFilter === '30') {
        matchVencimiento = dias !== null && dias >= 0 && dias <= 30
      }

      if (vencimientoFilter === '60') {
        matchVencimiento = dias !== null && dias >= 0 && dias <= 60
      }

      if (vencimientoFilter === '90') {
        matchVencimiento = dias !== null && dias >= 0 && dias <= 90
      }

      return matchSearch && matchSucursal && matchEstado && matchVencimiento
    })
  }, [lotes, search, sucursalFilter, estadoFilter, vencimientoFilter])

  const resumen = useMemo(() => {
    return {
      total_lotes: lotesFiltrados.length,
      stock_actual: lotesFiltrados.reduce(
        (total, lote) => total + Number(lote.cantidad_actual || 0),
        0,
      ),
      disponibles: lotesFiltrados.filter(
        (lote) => lote.estado_lote === 'DISPONIBLE',
      ).length,
      agotados: lotesFiltrados.filter((lote) => lote.estado_lote === 'AGOTADO')
        .length,
      bloqueados: lotesFiltrados.filter(
        (lote) => lote.estado_lote === 'BLOQUEADO',
      ).length,
      valor_total: lotesFiltrados.reduce(
        (total, lote) => total + getValorStock(lote),
        0,
      ),
    }
  }, [lotesFiltrados])

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

          <p className="mt-1 text-[11px] text-slate-400">
            {lote.producto?.codigo || '-'}
          </p>
        </div>
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
          {lote.numero_lote || '-'}
        </span>
      ),
    },
    {
      key: 'cantidad_inicial',
      header: 'Stock lote',
      render: (lote) => (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Inicial: {lote.cantidad_inicial}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                lote.cantidad_actual <= 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              Actual: {lote.cantidad_actual}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Vendido: {getCantidadVendida(lote)}
          </p>
        </div>
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
      key: 'costo_unitario',
      header: 'Costo / Valor',
      render: (lote) => (
        <div>
          <p className="text-sm font-medium text-slate-800">
            {formatMoney(lote.costo_unitario)}
          </p>

          <p className="text-xs text-slate-500">
            Valor: {formatMoney(getValorStock(lote))}
          </p>
        </div>
      ),
    },
    {
      key: 'estado_lote',
      header: 'Estado',
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
      key: 'acciones',
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
              className="absolute right-0 top-8 z-30 w-40 rounded border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => handleView(lote)}
                className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver detalle
              </button>

              <button
                type="button"
                onClick={() => handleVerKardex(lote)}
                className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver Kardex
              </button>

              {lote.estado_lote === 'DISPONIBLE' && (
                <button
                  type="button"
                  onClick={() => handleBloquear(lote)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-orange-600 transition hover:bg-orange-50"
                >
                  Bloquear
                </button>
              )}

              {lote.estado_lote === 'BLOQUEADO' && (
                <button
                  type="button"
                  onClick={() => handleDesbloquear(lote)}
                  className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-emerald-600 transition hover:bg-emerald-50"
                >
                  Desbloquear
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
          title="Lotes"
          buttonText="Actualizar"
          onButtonClick={refetchLotes}
          icon={<InventoryIcon />}
          actions={
            <button
              onClick={handleExport}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
            >
              <ExportIcon />
              Exportar
            </button>
          }
        />

        <main className="px-8 py-5">
          {error && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
            <ResumenCard label="Lotes" value={resumen.total_lotes} />
            <ResumenCard label="Stock actual" value={resumen.stock_actual} />
            <ResumenCard label="Disponibles" value={resumen.disponibles} />
            <ResumenCard label="Agotados" value={resumen.agotados} />
            <ResumenCard label="Bloqueados" value={resumen.bloqueados} />
            <ResumenCard
              label="Valor stock"
              value={formatMoney(resumen.valor_total)}
            />
          </section>

          <section className="mb-5 rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_180px_180px_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto, lote, código, sucursal o compra..."
                className="rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />

              <select
                value={sucursalFilter}
                onChange={(e) => setSucursalFilter(e.target.value)}
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas las sucursales</option>

                {sucursalesOptions.map((lote) => (
                  <option key={lote.sucursal_id} value={lote.sucursal_id}>
                    {lote.sucursal?.nombre || `Sucursal ${lote.sucursal_id}`}
                  </option>
                ))}
              </select>

              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todos los estados</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="AGOTADO">Agotado</option>
                <option value="BLOQUEADO">Bloqueado</option>
                <option value="VENCIDO">Vencido</option>
                <option value="ANULADO">Anulado</option>
              </select>

              <select
                value={vencimientoFilter}
                onChange={(e) =>
                  setVencimientoFilter(e.target.value as FiltroVencimiento)
                }
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todos los vencimientos</option>
                <option value="VENCIDO">Vencidos</option>
                <option value="30">Vencen en 30 días</option>
                <option value="60">Vencen en 60 días</option>
                <option value="90">Vencen en 90 días</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSucursalFilter('')
                  setEstadoFilter('')
                  setVencimientoFilter('')
                }}
                className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </section>

          <DataTable
            title="Listado de lotes"
            columns={columns}
            data={lotesFiltrados}
            isLoading={isLoading}
            loadingMessage="Cargando lotes..."
            emptyMessage="No existen lotes registrados"
          />
        </main>
      </div>

      <LoteDetailModal
        isOpen={!!selectedLote}
        lote={selectedLote}
        onClose={() => setSelectedLote(null)}
      />
    </div>
  )
}

function ResumenCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default LotesPage