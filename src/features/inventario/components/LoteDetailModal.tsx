import type { ReactNode } from 'react'
import type { Lote } from '../types/lote.types'

type Props = {
  isOpen: boolean
  lote: Lote | null
  onClose: () => void
}

export default function LoteDetailModal({ isOpen, lote, onClose }: Props) {
  if (!isOpen || !lote) return null

  const vencimiento = getEstadoVencimiento(lote)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Detalle de lote
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Información completa del lote, stock, vencimiento y compra.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-2xl leading-none text-slate-400 transition hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="mb-5 rounded-sm border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {lote.producto?.nombre_comercial || '-'}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {lote.producto?.nombre_generico || 'Sin nombre genérico'}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                    Código: {lote.producto?.codigo || '-'}
                  </span>

                  <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                    Lote: {lote.numero_lote || '-'}
                  </span>

                  <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                    Sucursal: {lote.sucursal?.nombre || '-'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoLoteClass(
                    lote.estado_lote,
                  )}`}
                >
                  {lote.estado_lote}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${vencimiento.className}`}
                >
                  {vencimiento.label}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailSection title="Producto">
              <DetailItem
                label="Nombre comercial"
                value={lote.producto?.nombre_comercial || '-'}
              />

              <DetailItem
                label="Nombre genérico"
                value={lote.producto?.nombre_generico || '-'}
              />

              <DetailItem label="Código" value={lote.producto?.codigo || '-'} />

              <DetailItem
                label="Código de barras"
                value={lote.producto?.codigo_barras || '-'}
              />
            </DetailSection>

            <DetailSection title="Sucursal">
              <DetailItem label="Sucursal" value={lote.sucursal?.nombre || '-'} />
              <DetailItem label="Código" value={lote.sucursal?.codigo || '-'} />
              <DetailItem
                label="Dirección"
                value={
                  lote.sucursal?.direccion_comercial ||
                  lote.sucursal?.direccion_fiscal ||
                  '-'
                }
              />
            </DetailSection>

            <DetailSection title="Lote y vencimiento">
              <DetailItem label="N° lote" value={lote.numero_lote || '-'} />

              <DetailItem
                label="Fecha fabricación"
                value={formatDate(lote.fecha_fabricacion)}
              />

              <DetailItem
                label="Fecha vencimiento"
                value={formatDate(lote.fecha_vencimiento)}
              />

              <DetailItem label="Estado vencimiento" value={vencimiento.label} />
            </DetailSection>

            <DetailSection title="Stock">
              <DetailItem
                label="Cantidad inicial"
                value={lote.cantidad_inicial}
              />

              <DetailItem label="Cantidad actual" value={lote.cantidad_actual} />

              <DetailItem
                label="Cantidad vendida"
                value={getCantidadVendida(lote)}
              />
            </DetailSection>

            <DetailSection title="Costos">
              <DetailItem
                label="Costo unitario"
                value={formatMoney(lote.costo_unitario)}
              />

              <DetailItem
                label="Valor actual del lote"
                value={formatMoney(getValorStock(lote))}
              />
            </DetailSection>

            <DetailSection title="Compra">
              <DetailItem label="Comprobante" value={getComprobante(lote)} />

              <DetailItem
                label="Fecha emisión"
                value={formatDate(lote.compra?.fecha_emision)}
              />

              <DetailItem
                label="Fecha recepción"
                value={formatDate(lote.compra?.fecha_recepcion)}
              />
            </DetailSection>
          </div>

          {lote.observacion && (
            <div className="mt-4 rounded-sm border border-slate-200 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Observación
              </p>

              <p className="text-sm leading-relaxed text-slate-500">
                {lote.observacion}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
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

function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-sm border border-slate-200 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">{title}</p>

      <div className="space-y-2">{children}</div>
    </div>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  )
}