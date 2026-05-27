import { CloseIcon } from '../../../components/icons'
import type { Compra } from '../types/compra.types'

type Props = {
  isOpen: boolean
  compra: Compra | null
  onClose: () => void
}

export default function ViewCompraModal({ isOpen, compra, onClose }: Props) {
  if (!isOpen || !compra) return null

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function formatDate(value?: string | null) {
    if (!value) return '-'

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

    function getComprobante(compraActual: Compra) {
    const serie = compraActual.serie || ''
    const numero = compraActual.numero || ''

    if (!serie && !numero) return '-'

    return `${serie}${serie && numero ? '-' : ''}${numero}`
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-medium text-slate-800">
              Detalle de compra
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Compra #{compra.id} · {compra.tipo_comprobante} {getComprobante(compra)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[calc(90vh-76px)] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-4 gap-4">
            <InfoCard
              label="Proveedor"
              value={
                compra.proveedor?.nombre_comercial ||
                compra.proveedor?.razon_social ||
                '-'
              }
              subValue={compra.proveedor?.numero_documento || 'Sin documento'}
            />

            <InfoCard
              label="Sucursal"
              value={compra.sucursal?.nombre || '-'}
              subValue={compra.sucursal?.codigo || 'Sin código'}
            />

            <InfoCard
              label="Comprobante"
              value={compra.tipo_comprobante}
              subValue={getComprobante(compra)}
            />

            <InfoCard
              label="Estado"
              value={compra.estado_compra}
              badgeClassName={
                compra.estado_compra === 'REGISTRADA'
                  ? 'bg-emerald-50 text-emerald-700'
                  : compra.estado_compra === 'BORRADOR'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
              }
            />

            <InfoCard
              label="Fecha emisión"
              value={formatDate(compra.fecha_emision)}
            />

            <InfoCard
              label="Fecha recepción"
              value={formatDate(compra.fecha_recepcion)}
            />

            <InfoCard
              label="Registrado por"
              value={
                compra.usuario
                  ? `${compra.usuario.nombres} ${compra.usuario.apellidos || ''}`
                  : '-'
              }
              subValue={compra.usuario?.correo || ''}
            />

            <InfoCard
              label="Productos"
              value={String(compra.detalles?.length || 0)}
              subValue="ítems registrados"
            />
          </div>

          {compra.observacion && (
            <div className="mt-5 rounded border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">Observación</p>
              <p className="mt-1 text-sm text-slate-700">
                {compra.observacion}
              </p>
            </div>
          )}

          <div className="mt-5 overflow-x-auto rounded border border-slate-200">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-medium text-slate-500">
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Costo unitario</th>
                  <th className="px-3 py-2">Lote</th>
                  <th className="px-3 py-2">Vencimiento</th>
                  <th className="px-3 py-2 text-right">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {compra.detalles?.length ? (
                  compra.detalles.map((detalle) => (
                    <tr
                      key={detalle.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-3 py-2">
                        <div>
                          <p className="font-medium text-slate-800">
                            {detalle.producto?.nombre_comercial || '-'}
                          </p>

                          <p className="text-xs text-slate-500">
                            {detalle.producto?.nombre_generico ||
                              detalle.producto?.unidad_medida ||
                              ''}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {detalle.producto?.codigo || '-'}
                        </span>
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {detalle.cantidad}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {formatMoney(detalle.costo_unitario)}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {detalle.lote || '-'}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {formatDate(detalle.fecha_vencimiento)}
                      </td>

                      <td className="px-3 py-2 text-right font-medium text-slate-800">
                        {formatMoney(detalle.subtotal)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-6 text-center text-sm text-slate-500"
                    >
                      No hay productos registrados en esta compra
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {compra.lotes && compra.lotes.length > 0 && (
            <div className="mt-5 overflow-x-auto rounded border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
                <h4 className="text-sm font-medium text-slate-700">
                  Lotes generados
                </h4>
              </div>

              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead className="bg-white">
                  <tr className="text-left text-xs font-medium text-slate-500">
                    <th className="px-3 py-2">Lote</th>
                    <th className="px-3 py-2">Vencimiento</th>
                    <th className="px-3 py-2">Cantidad inicial</th>
                    <th className="px-3 py-2">Cantidad actual</th>
                    <th className="px-3 py-2">Costo</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {compra.lotes.map((lote) => (
                    <tr key={lote.id} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-medium text-slate-800">
                        {lote.numero_lote}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {formatDate(lote.fecha_vencimiento)}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {lote.cantidad_inicial}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {lote.cantidad_actual}
                      </td>

                      <td className="px-3 py-2 text-slate-700">
                        {formatMoney(lote.costo_unitario)}
                      </td>

                      <td className="px-3 py-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          {lote.estado_lote}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <div className="w-full max-w-sm rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">
                  {formatMoney(compra.subtotal)}
                </span>
              </div>

              <div className="flex justify-between py-1 text-sm">
                <span className="text-slate-500">IGV</span>
                <span className="font-medium text-slate-700">
                  {formatMoney(compra.igv)}
                </span>
              </div>

              <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="font-bold text-slate-900">
                  {formatMoney(compra.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer close button removed as requested */}
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  subValue,
  badgeClassName,
}: {
  label: string
  value: string
  subValue?: string
  badgeClassName?: string
}) {
  return (
    <div className="rounded border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      {badgeClassName ? (
        <span
          className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeClassName}`}
        >
          {value}
        </span>
      ) : (
        <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
      )}

      {subValue && <p className="mt-1 text-xs text-slate-500">{subValue}</p>}
    </div>
  )
}