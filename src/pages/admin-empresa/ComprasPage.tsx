import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { CompraIcon, ExportIcon, ImportIcon } from '../../components/icons'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import CreateCompraModal from '../../features/compra/components/CreateCompraModal'
import ViewCompraModal from '../../features/compra/components/ViewCompraModal'

import { useCompras } from '../../features/compra/hooks/useCompras'
import { useAnularCompra } from '../../features/compra/hooks/useAnularCompra'

import type { Compra } from '../../features/compra/types/compra.types'

function ComprasPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null)

  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  const {
    compras,
    isLoading,
    error,
    refetch: refetchCompras,
  } = useCompras()

  const {
    anularCompra,
    isLoading: isAnulandoCompra,
    error: anularError,
    setError: setAnularError,
  } = useAnularCompra()

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

  function handleImport() {
    console.log('Importar compras')
  }

  function handleExport() {
    console.log('Exportar compras')
  }

  function handleView(compra: Compra) {
    setSelectedCompra(compra)
    setOpenViewModal(true)
    setOpenMenuId(null)
  }

  async function handleAnular(compra: Compra) {
    setOpenMenuId(null)
    setAnularError(null)

    if (compra.estado_compra === 'ANULADA') {
      setAnularError('Esta compra ya se encuentra anulada.')
      return
    }

    const confirmAnular = window.confirm(
      `¿Seguro que deseas anular la compra ${getComprobante(compra)}?\n\nEsta acción restará el stock ingresado, actualizará los lotes y registrará un movimiento de anulación en el kardex.`,
    )

    if (!confirmAnular) return

    const motivo =
      window.prompt(
        'Ingresa el motivo de la anulación:',
        'Comprobante registrado por error',
      ) || 'Anulación de compra'

    const compraAnulada = await anularCompra(compra.id, motivo)

    if (!compraAnulada) return

    refetchCompras()
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

  function getComprobante(compra: Compra) {
    const serie = compra.serie || ''
    const numero = compra.numero || ''

    if (!serie && !numero) return '-'

    return `${serie}${serie && numero ? '-' : ''}${numero}`
  }

  function getTotalProductos(compra: Compra) {
    return compra.detalles?.length || 0
  }

  const columns: DataTableColumn<Compra>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'fecha_emision',
      header: 'Fecha',
      render: (compra) => (
        <div>
          <p className="font-medium text-slate-800">
            {formatDate(compra.fecha_emision)}
          </p>

          <p className="text-xs text-slate-500">
            Recepción: {formatDate(compra.fecha_recepcion)}
          </p>
        </div>
      ),
    },
    {
      key: 'proveedor_id',
      header: 'Proveedor',
      render: (compra) => (
        <div>
          <p className="font-medium text-slate-800">
            {compra.proveedor?.nombre_comercial ||
              compra.proveedor?.razon_social ||
              '-'}
          </p>

          <p className="text-xs text-slate-500">
            {compra.proveedor?.numero_documento || 'Sin documento'}
          </p>
        </div>
      ),
    },
    {
      key: 'tipo_comprobante',
      header: 'Comprobante',
      render: (compra) => (
        <div>
          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {compra.tipo_comprobante}
          </span>

          <p className="mt-1 text-xs text-slate-500">
            {getComprobante(compra)}
          </p>
        </div>
      ),
    },
    {
      key: 'sucursal_id',
      header: 'Sucursal',
      render: (compra) => compra.sucursal?.nombre || '-',
    },
    {
      key: 'detalles',
      header: 'Productos',
      render: (compra) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {getTotalProductos(compra)}
        </span>
      ),
    },
    {
      key: 'subtotal',
      header: 'Subtotal',
      render: (compra) => (
        <span className="text-sm text-slate-700">
          {formatMoney(compra.subtotal)}
        </span>
      ),
    },
    {
      key: 'igv',
      header: 'IGV',
      render: (compra) => (
        <span className="text-sm text-slate-700">
          {formatMoney(compra.igv)}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (compra) => (
        <span className="font-semibold text-slate-800">
          {formatMoney(compra.total)}
        </span>
      ),
    },
    {
      key: 'estado_compra',
      header: 'Estado',
      render: (compra) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            compra.estado_compra === 'REGISTRADA'
              ? 'bg-emerald-50 text-emerald-700'
              : compra.estado_compra === 'BORRADOR'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-red-50 text-red-700'
          }`}
        >
          {compra.estado_compra}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Acciones',
      render: (compra) => (
        <div ref={actionsMenuRef} className="relative flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()

              setOpenMenuId((current) =>
                current === compra.id ? null : compra.id,
              )
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
            title="Acciones"
          >
            <span className="text-lg leading-none">⋮</span>
          </button>

          {openMenuId === compra.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-36 rounded border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                onClick={() => handleView(compra)}
                className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Ver detalle
              </button>

              {compra.estado_compra !== 'ANULADA' && (
                <button
                  type="button"
                  onClick={() => handleAnular(compra)}
                  disabled={isAnulandoCompra}
                  className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAnulandoCompra ? 'Anulando...' : 'Anular'}
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
          title="Compras"
          buttonText="Nueva Compra"
          onButtonClick={handleNew}
          icon={<CompraIcon />}
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
          {(error || anularError) && (
            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-sm text-red-600">
              {error || anularError}
            </div>
          )}

          <DataTable
            title="Listado de compras"
            columns={columns}
            data={compras}
            isLoading={isLoading}
            loadingMessage="Cargando compras..."
            emptyMessage="No existen compras registradas"
          />
        </main>
      </div>

      <CreateCompraModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => {
          setOpenCreateModal(false)
          refetchCompras()
        }}
      />

      <ViewCompraModal
        isOpen={openViewModal}
        compra={selectedCompra}
        onClose={() => {
          setOpenViewModal(false)
          setSelectedCompra(null)
        }}
      />
    </div>
  )
}

export default ComprasPage