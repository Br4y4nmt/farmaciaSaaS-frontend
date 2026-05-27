import { useEffect, useState } from 'react'
import { api } from '../../../services/api'

type ProductoLotes = {
  id: number
  empresa_id: number
  codigo: string | null
  codigo_barras: string | null
  nombre_generico: string | null
  nombre_comercial: string
  unidad_medida: string | null
  precio_venta: number
  stock_minimo: number
  stock_maximo: number
  estado: boolean
}

type ResumenLotes = {
  total_lotes: number
  stock_total_lotes: number
  lotes_disponibles: number
  lotes_agotados: number
  lotes_bloqueados: number
  lotes_vencidos: number
  lotes_por_vencer_30: number
  valor_total_stock: number
}

type EstadoVencimiento =
  | 'SIN_FECHA'
  | 'VENCIDO'
  | 'VENCE_HOY'
  | 'POR_VENCER_30'
  | 'POR_VENCER_60'
  | 'POR_VENCER_90'
  | 'VIGENTE'

type LoteProductoItem = {
  id: number
  empresa_id: number
  sucursal_id: number
  producto_id: number
  compra_id: number | null
  compra_detalle_id: number | null

  numero_lote: string | null
  fecha_fabricacion: string | null
  fecha_vencimiento: string | null

  cantidad_inicial: number
  cantidad_actual: number
  cantidad_vendida: number

  costo_unitario: number
  valor_stock: number

  estado_lote: string
  estado: boolean
  observacion: string | null

  estado_vencimiento: EstadoVencimiento
  vencimiento_label: string
  dias_para_vencer: number | null

  sucursal: {
    id: number
    codigo: string | null
    nombre: string
    direccion: string | null
    departamento: string | null
    provincia: string | null
    distrito: string | null
  } | null

  compra: {
    id: number
    tipo_comprobante: string | null
    serie: string | null
    numero: string | null
    fecha_emision: string | null
    fecha_recepcion: string | null
  } | null
}

type GetLotesPorProductoResponse = {
  producto: ProductoLotes
  resumen: ResumenLotes
  lotes: LoteProductoItem[]
}

type Props = {
  isOpen: boolean
  productoId: number | null
  onClose: () => void
}

export default function LotesPorProductoModal({
  isOpen,
  productoId,
  onClose,
}: Props) {
  const [producto, setProducto] = useState<ProductoLotes | null>(null)
  const [resumen, setResumen] = useState<ResumenLotes | null>(null)
  const [lotes, setLotes] = useState<LoteProductoItem[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !productoId) return

    fetchLotesPorProducto(productoId)
  }, [isOpen, productoId])

  async function fetchLotesPorProducto(id: number) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get('/inventario/lotes-por-producto', {
        params: {
          producto_id: id,
        },
      })

      const data: GetLotesPorProductoResponse = response.data.data

      setProducto(data.producto)
      setResumen(data.resumen)
      setLotes(data.lotes || [])
    } catch (error: any) {
      console.error(error)

      const message =
        error.response?.data?.message ||
        'No se pudieron obtener los lotes del producto'

      setError(message)
      setProducto(null)
      setResumen(null)
      setLotes([])
    } finally {
      setIsLoading(false)
    }
  }

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function formatDate(value: string | null) {
    if (!value) return '-'

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function getEstadoLoteClass(estado: string) {
    const value = String(estado || '').toUpperCase()

    if (value === 'DISPONIBLE') return 'bg-green-100 text-green-700'
    if (value === 'AGOTADO') return 'bg-slate-100 text-slate-700'
    if (value === 'BLOQUEADO') return 'bg-orange-100 text-orange-700'
    if (value === 'ANULADO') return 'bg-red-100 text-red-700'

    return 'bg-slate-100 text-slate-700'
  }

  function getVencimientoClass(estado: EstadoVencimiento) {
    const styles: Record<EstadoVencimiento, string> = {
      SIN_FECHA: 'bg-slate-100 text-slate-700',
      VENCIDO: 'bg-red-100 text-red-700',
      VENCE_HOY: 'bg-red-100 text-red-700',
      POR_VENCER_30: 'bg-orange-100 text-orange-700',
      POR_VENCER_60: 'bg-yellow-100 text-yellow-700',
      POR_VENCER_90: 'bg-blue-100 text-blue-700',
      VIGENTE: 'bg-green-100 text-green-700',
    }

    return styles[estado]
  }

  function formatSucursalLocation(lote: LoteProductoItem) {
    const parts = [
      lote.sucursal?.departamento,
      lote.sucursal?.provincia,
      lote.sucursal?.distrito,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(' / ') : null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Lotes del producto
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Consulta lotes, vencimientos, stock disponible y origen de compra.
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
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-sm text-slate-500">
              Cargando lotes del producto...
            </div>
          ) : error ? (
            <div className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : (
            <>
              {producto && (
                <div className="mb-5 rounded-sm border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {producto.nombre_comercial}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {producto.nombre_generico || 'Sin nombre genérico'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                          Código: {producto.codigo || '-'}
                        </span>

                        <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                          Barras: {producto.codigo_barras || '-'}
                        </span>

                        <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                          Unidad: {producto.unidad_medida || '-'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Precio venta</p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatMoney(producto.precio_venta)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {resumen && (
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                  <ResumenCard label="Total lotes" value={resumen.total_lotes} />
                  <ResumenCard
                    label="Stock lotes"
                    value={resumen.stock_total_lotes}
                  />
                  <ResumenCard
                    label="Disponibles"
                    value={resumen.lotes_disponibles}
                  />
                  <ResumenCard
                    label="Agotados"
                    value={resumen.lotes_agotados}
                  />
                  <ResumenCard
                    label="Bloqueados"
                    value={resumen.lotes_bloqueados}
                  />
                  <ResumenCard
                    label="Vencidos"
                    value={resumen.lotes_vencidos}
                  />
                  <ResumenCard
                    label="Valor stock"
                    value={formatMoney(resumen.valor_total_stock)}
                  />
                </div>
              )}

              <div className="overflow-hidden rounded-sm border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Lote
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Sucursal
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Stock
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Vencimiento
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Costo / Valor
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Compra
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {lotes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No se encontraron lotes para este producto.
                        </td>
                      </tr>
                    ) : (
                      lotes.map((lote) => {
                        const location = formatSucursalLocation(lote)

                        return (
                          <tr key={lote.id}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-slate-800">
                                {lote.numero_lote || 'Sin lote'}
                              </p>

                              <p className="text-xs text-slate-500">
                                Fab: {formatDate(lote.fecha_fabricacion)}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {lote.sucursal?.nombre || '-'}
                              </p>

                              <p className="text-xs text-slate-500">
                                {lote.sucursal?.codigo || 'Sin código'}
                              </p>

                              {location && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {location}
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                  Inicial: {lote.cantidad_inicial}
                                </span>

                                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                                  Actual: {lote.cantidad_actual}
                                </span>
                              </div>

                              <p className="mt-1 text-[11px] text-slate-500">
                                Vendido: {lote.cantidad_vendida}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {formatDate(lote.fecha_vencimiento)}
                              </p>

                              <span
                                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getVencimientoClass(
                                  lote.estado_vencimiento,
                                )}`}
                              >
                                {lote.vencimiento_label}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {formatMoney(lote.costo_unitario)}
                              </p>

                              <p className="text-xs text-slate-500">
                                Valor: {formatMoney(lote.valor_stock)}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              {lote.compra ? (
                                <div>
                                  <p className="text-sm font-medium text-slate-800">
                                    {lote.compra.tipo_comprobante || '-'}{' '}
                                    {lote.compra.serie || ''}
                                    {lote.compra.numero
                                      ? `-${lote.compra.numero}`
                                      : ''}
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    Emisión:{' '}
                                    {formatDate(lote.compra.fecha_emision)}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-500">
                                  -
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoLoteClass(
                                    lote.estado_lote,
                                  )}`}
                                >
                                  {lote.estado_lote}
                                </span>

                                <p
                                  className={`text-[11px] ${
                                    lote.estado
                                      ? 'text-slate-500'
                                      : 'text-red-500'
                                  }`}
                                >
                                  {lote.estado ? 'Activo' : 'Inactivo'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
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

function ResumenCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}