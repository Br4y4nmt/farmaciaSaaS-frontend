import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { FarmaceuticoSidebar } from '../../components/layout/siderbars/FarmaceuticoSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'
import { TableFilterBar } from '../../components/ui/TableFilterBar'

import { CompraIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

type EstadoVenta = 'REGISTRADA' | 'ANULADA'

type VentaHistorial = {
  id: number
  serie: string
  numero: string
  fecha: string
  cliente_nombre: string
  metodo_pago: {
    id: number
    codigo: string
    nombre: string
    tipo: string
  }
  referencia_pago?: string | null
  total: number
  estado: EstadoVenta
  caja?: {
    id: number
    codigo: string
  } | null
}

const ventasMock: VentaHistorial[] = [
  {
    id: 1,
    serie: 'NV001',
    numero: '00000001',
    fecha: '2026-05-29T17:01:00',
    cliente_nombre: 'CLIENTE VARIOS',
    metodo_pago: {
      id: 1,
      codigo: 'EFECTIVO',
      nombre: 'Efectivo',
      tipo: 'EFECTIVO',
    },
    referencia_pago: null,
    total: 4,
    estado: 'REGISTRADA',
    caja: {
      id: 1,
      codigo: 'CAJA-000001',
    },
  },
  {
    id: 2,
    serie: 'NV001',
    numero: '00000002',
    fecha: '2026-05-29T17:05:00',
    cliente_nombre: 'CLIENTE VARIOS',
    metodo_pago: {
      id: 2,
      codigo: 'YAPE',
      nombre: 'Yape',
      tipo: 'DIGITAL',
    },
    referencia_pago: 'OP-985412',
    total: 2,
    estado: 'REGISTRADA',
    caja: {
      id: 1,
      codigo: 'CAJA-000001',
    },
  },
  {
    id: 3,
    serie: 'NV001',
    numero: '00000003',
    fecha: '2026-05-29T17:20:00',
    cliente_nombre: 'CLIENTE VARIOS',
    metodo_pago: {
      id: 3,
      codigo: 'PLIN',
      nombre: 'Plin',
      tipo: 'DIGITAL',
    },
    referencia_pago: 'PLIN-445122',
    total: 8.5,
    estado: 'ANULADA',
    caja: {
      id: 1,
      codigo: 'CAJA-000001',
    },
  },
]

function formatMoney(value: number | string | null | undefined) {
  return `S/ ${Number(value || 0).toFixed(2)}`
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function HistorialVentasPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [menuCoords, setMenuCoords] = useState<{
    top: number
    left: number
  } | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

  const ventas = ventasMock
  const isLoadingVentas = false
  const ventasError = null

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
        setMenuCoords(null)
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

  function handleNuevaVenta() {
    navigate('/farmaceutico/pos/venta-rapida')
  }

  function handleVerDetalle(venta: VentaHistorial) {
    console.log('Ver detalle venta:', venta)
    setOpenMenuId(null)
    setMenuCoords(null)
  }

  function handleAnularVenta(venta: VentaHistorial) {
    console.log('Anular venta:', venta)
    setOpenMenuId(null)
    setMenuCoords(null)
  }

  const resumen = useMemo(() => {
    const ventasRegistradas = ventas.filter(
      (venta) => venta.estado === 'REGISTRADA',
    )

    const totalRegistrado = ventasRegistradas.reduce(
      (acc, venta) => acc + Number(venta.total || 0),
      0,
    )

    const totalAnuladas = ventas.filter(
      (venta) => venta.estado === 'ANULADA',
    ).length

    return {
      totalVentas: ventas.length,
      totalRegistrado,
      totalAnuladas,
    }
  }, [ventas])

  const columns: DataTableColumn<VentaHistorial>[] = [
    {
      key: 'id',
      header: 'N°',
      render: (_, index) => index + 1,
    },
    {
      key: 'numero',
      header: 'Venta',
      render: (venta) => (
        <div>
          <p className="font-medium text-slate-800">
            {venta.serie}-{venta.numero}
          </p>

          <p className="text-xs text-slate-500">
            {venta.caja?.codigo || 'Sin caja'}
          </p>
        </div>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (venta) => (
        <span className="text-sm text-slate-700">
          {formatDate(venta.fecha)}
        </span>
      ),
    },
    {
      key: 'cliente_nombre',
      header: 'Cliente',
      render: (venta) => (
        <div>
          <p className="font-medium text-slate-800">
            {venta.cliente_nombre || 'CLIENTE VARIOS'}
          </p>

          <p className="text-xs text-slate-500">Nota de venta</p>
        </div>
      ),
    },
    {
      key: 'metodo_pago',
      header: 'Método',
      render: (venta) => (
        <div>
          <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
            {venta.metodo_pago?.nombre || '-'}
          </span>

          <p className="mt-1 text-xs text-slate-500">
            {venta.metodo_pago?.tipo || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'referencia_pago',
      header: 'Referencia',
      render: (venta) => (
        <span className="text-sm text-slate-700">
          {venta.referencia_pago || '-'}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (venta) => (
        <span className="font-semibold text-slate-900">
          {formatMoney(venta.total)}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (venta) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            venta.estado === 'REGISTRADA'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {venta.estado === 'REGISTRADA' ? 'Registrada' : 'Anulada'}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (venta) => (
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              const current = openMenuId === venta.id ? null : venta.id
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

          {openMenuId === venta.id &&
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
                  onClick={() => handleVerDetalle(venta)}
                  className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Ver detalle
                </button>

                <button
                  type="button"
                  onClick={() => handleAnularVenta(venta)}
                  disabled={venta.estado === 'ANULADA'}
                  className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anular venta
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
      <FarmaceuticoSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Historial de ventas"
          buttonText="Nueva venta"
          onButtonClick={handleNuevaVenta}
          icon={<CompraIcon />}
        />

        <main className="px-8 py-5">
          {ventasError && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {ventasError}
            </div>
          )}

          

          <DataTable
            title="Listado de ventas"
            columns={columns}
            data={ventas}
            isLoading={isLoadingVentas}
            loadingMessage="Cargando ventas..."
            emptyMessage="No existen ventas registradas"
            toolbarContent={<TableFilterBar />}
          />
        </main>
      </div>
    </div>
  )
}

export default HistorialVentasPage