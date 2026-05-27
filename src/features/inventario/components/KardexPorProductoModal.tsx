import { useEffect, useState } from 'react'
import { api } from '../../../services/api'
import { CloseIcon } from '../../../components/icons'

type ProductoKardex = {
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

type KardexResumen = {
  total_movimientos: number
  entradas: number
  salidas: number
  cantidad_entrada: number
  cantidad_salida: number
}

type TipoOperacion = 'ENTRADA' | 'SALIDA' | 'NEUTRO'

type KardexMovimiento = {
  id: number
  empresa_id: number
  sucursal_id: number | null
  producto_id: number
  lote_id: number | null

  tipo_movimiento: string
  tipo_operacion: TipoOperacion

  cantidad: number
  stock_anterior: number
  stock_nuevo: number

  motivo: string | null
  observacion: string | null

  referencia_tipo: string | null
  referencia_id: string | number | null

  usuario_id: number | null

  fecha_movimiento: string | null
  created_at: string | null

  sucursal: {
    id: number
    codigo: string | null
    nombre: string
    direccion: string | null
    departamento: string | null
    provincia: string | null
    distrito: string | null
  } | null
}

type GetKardexPorProductoResponse = {
  producto: ProductoKardex
  resumen: KardexResumen
  total: number
  page: number
  limit: number
  totalPages: number
  movimientos: KardexMovimiento[]
}

type Props = {
  isOpen: boolean
  productoId: number | null
  onClose: () => void
}

export default function KardexPorProductoModal({
  isOpen,
  productoId,
  onClose,
}: Props) {
  const [producto, setProducto] = useState<ProductoKardex | null>(null)
  const [resumen, setResumen] = useState<KardexResumen | null>(null)
  const [movimientos, setMovimientos] = useState<KardexMovimiento[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !productoId) return

    fetchKardexPorProducto(productoId)
  }, [isOpen, productoId])

  async function fetchKardexPorProducto(id: number) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get('/inventario/kardex-por-producto', {
        params: {
          producto_id: id,
          limit: 100,
        },
      })

      const data: GetKardexPorProductoResponse = response.data.data

      setProducto(data.producto)
      setResumen(data.resumen)
      setMovimientos(data.movimientos || [])
    } catch (error: any) {
      console.error(error)

      const message =
        error.response?.data?.message ||
        'No se pudo obtener el kardex del producto'

      setError(message)
      setProducto(null)
      setResumen(null)
      setMovimientos([])
    } finally {
      setIsLoading(false)
    }
  }

  function formatDateTime(value: string | null) {
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

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  function getOperacionClass(tipo: TipoOperacion) {
    const styles: Record<TipoOperacion, string> = {
      ENTRADA: 'bg-green-100 text-green-700',
      SALIDA: 'bg-red-100 text-red-700',
      NEUTRO: 'bg-slate-100 text-slate-700',
    }

    return styles[tipo]
  }

  function getCantidadClass(tipo: TipoOperacion) {
    const styles: Record<TipoOperacion, string> = {
      ENTRADA: 'text-green-700',
      SALIDA: 'text-red-700',
      NEUTRO: 'text-slate-700',
    }

    return styles[tipo]
  }

  function formatCantidad(movimiento: KardexMovimiento) {
    if (movimiento.tipo_operacion === 'ENTRADA') {
      return `+${movimiento.cantidad}`
    }

    if (movimiento.tipo_operacion === 'SALIDA') {
      return `-${movimiento.cantidad}`
    }

    return `${movimiento.cantidad}`
  }

  function formatSucursalLocation(movimiento: KardexMovimiento) {
    const parts = [
      movimiento.sucursal?.departamento,
      movimiento.sucursal?.provincia,
      movimiento.sucursal?.distrito,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(' / ') : null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-7xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Kardex del producto
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Historial de entradas, salidas y ajustes del inventario.
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

        <div className="max-h-[78vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-500">
              Cargando kardex del producto...
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
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                  <ResumenCard
                    label="Movimientos"
                    value={resumen.total_movimientos}
                  />

                  <ResumenCard label="Entradas" value={resumen.entradas} />

                  <ResumenCard label="Salidas" value={resumen.salidas} />

                  <ResumenCard
                    label="Cant. entrada"
                    value={resumen.cantidad_entrada}
                  />

                  <ResumenCard
                    label="Cant. salida"
                    value={resumen.cantidad_salida}
                  />
                </div>
              )}

              <div className="overflow-hidden rounded-sm border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Fecha
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Movimiento
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Sucursal
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Cantidad
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Stock anterior
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Stock nuevo
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Referencia
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Motivo
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {movimientos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No se encontraron movimientos para este producto.
                        </td>
                      </tr>
                    ) : (
                      movimientos.map((movimiento) => {
                        const location = formatSucursalLocation(movimiento)

                        return (
                          <tr key={movimiento.id}>
                            <td className="whitespace-nowrap px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {formatDateTime(
                                  movimiento.fecha_movimiento ||
                                    movimiento.created_at,
                                )}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getOperacionClass(
                                  movimiento.tipo_operacion,
                                )}`}
                              >
                                {movimiento.tipo_movimiento}
                              </span>

                              <p className="mt-1 text-[11px] text-slate-500">
                                {movimiento.tipo_operacion}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {movimiento.sucursal?.nombre || '-'}
                              </p>

                              <p className="text-xs text-slate-500">
                                {movimiento.sucursal?.codigo || 'Sin código'}
                              </p>

                              {location && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {location}
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`text-sm font-bold ${getCantidadClass(
                                  movimiento.tipo_operacion,
                                )}`}
                              >
                                {formatCantidad(movimiento)}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm text-slate-700">
                                {movimiento.stock_anterior}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-slate-900">
                                {movimiento.stock_nuevo}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm text-slate-700">
                                  {movimiento.referencia_tipo || '-'}
                                </p>

                                <p className="text-xs text-slate-500">
                                  ID: {movimiento.referencia_id || '-'}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-700">
                                {movimiento.motivo || '-'}
                              </p>

                              {movimiento.observacion && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {movimiento.observacion}
                                </p>
                              )}
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