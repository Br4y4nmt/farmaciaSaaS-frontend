import { useEffect, useState } from 'react'
import { api } from '../../../services/api'
import type { EstadoStock } from '../types/inventario.types'
import { CloseIcon } from '../../../components/icons'

type ProductoStockSucursal = {
  id: number
  empresa_id: number
  codigo: string | null
  codigo_barras: string | null
  nombre_generico: string | null
  nombre_comercial: string
  unidad_medida: string | null
  stock_minimo: number
  stock_maximo: number
  precio_venta: number
  estado: boolean
}

type ResumenStockSucursal = {
  total_sucursales: number
  stock_total: number
  stock_reservado: number
  stock_disponible: number
  sucursales_con_stock: number
  sucursales_sin_stock: number
}

type StockSucursalItem = {
  inventario_id: number | null

  sucursal_id: number
  sucursal_codigo: string | null
  sucursal_nombre: string
  sucursal_direccion: string | null
  sucursal_departamento: string | null
  sucursal_provincia: string | null
  sucursal_distrito: string | null

  producto_id: number
  producto_codigo: string | null
  producto_codigo_barras: string | null
  producto_nombre_generico: string | null
  producto_nombre_comercial: string
  unidad_medida: string | null

  stock_actual: number
  stock_reservado: number
  stock_disponible: number
  stock_minimo: number
  stock_maximo: number

  ubicacion: string | null
  estado_inventario: boolean
  estado_stock: EstadoStock
}

type GetStockPorSucursalResponse = {
  producto: ProductoStockSucursal
  resumen: ResumenStockSucursal
  sucursales: StockSucursalItem[]
}

type Props = {
  isOpen: boolean
  productoId: number | null
  onClose: () => void
}

export default function StockPorSucursalModal({
  isOpen,
  productoId,
  onClose,
}: Props) {
  const [producto, setProducto] = useState<ProductoStockSucursal | null>(null)
  const [resumen, setResumen] = useState<ResumenStockSucursal | null>(null)
  const [sucursales, setSucursales] = useState<StockSucursalItem[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !productoId) return

    fetchStockPorSucursal(productoId)
  }, [isOpen, productoId])

  async function fetchStockPorSucursal(id: number) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get('/inventario/stock-por-sucursal', {
        params: {
          producto_id: id,
        },
      })

      const data: GetStockPorSucursalResponse = response.data.data

      setProducto(data.producto)
      setResumen(data.resumen)
      setSucursales(data.sucursales || [])
    } catch (error: any) {
      console.error(error)

      const message =
        error.response?.data?.message ||
        'No se pudo obtener el stock por sucursal'

      setError(message)
      setProducto(null)
      setResumen(null)
      setSucursales([])
    } finally {
      setIsLoading(false)
    }
  }

  function getEstadoStockLabel(estado: EstadoStock) {
    const labels: Record<EstadoStock, string> = {
      AGOTADO: 'Agotado',
      CRITICO: 'Crítico',
      BAJO: 'Bajo',
      SOBRESTOCK: 'Sobrestock',
      NORMAL: 'Normal',
    }

    return labels[estado]
  }

  function getEstadoStockClass(estado: EstadoStock) {
    const styles: Record<EstadoStock, string> = {
      AGOTADO: 'bg-red-100 text-red-700',
      CRITICO: 'bg-orange-100 text-orange-700',
      BAJO: 'bg-yellow-100 text-yellow-700',
      SOBRESTOCK: 'bg-purple-100 text-purple-700',
      NORMAL: 'bg-green-100 text-green-700',
    }

    return styles[estado]
  }

  function formatLocation(item: StockSucursalItem) {
    const parts = [
      item.sucursal_departamento,
      item.sucursal_provincia,
      item.sucursal_distrito,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(' / ') : null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Stock por sucursal
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Consulta el stock disponible del producto en cada sucursal.
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

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-sm text-slate-500">
              Cargando stock por sucursal...
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
                        S/ {Number(producto.precio_venta || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {resumen && (
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                  <ResumenCard label="Stock total" value={resumen.stock_total} />
                  <ResumenCard label="Disponible" value={resumen.stock_disponible} />
                  <ResumenCard label="Reservado" value={resumen.stock_reservado} />
                  <ResumenCard label="Con stock" value={resumen.sucursales_con_stock} />
                  <ResumenCard label="Sin stock" value={resumen.sucursales_sin_stock} />
                </div>
              )}

              <div className="overflow-hidden rounded-sm border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Sucursal
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Stock
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Ubicación
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {sucursales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No se encontró stock por sucursal.
                        </td>
                      </tr>
                    ) : (
                      sucursales.map((item) => {
                        const location = formatLocation(item)

                        return (
                          <tr key={item.sucursal_id}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-800">
                                {item.sucursal_nombre}
                              </p>

                              <p className="text-xs text-slate-500">
                                {item.sucursal_codigo || 'Sin código'}
                              </p>

                              {item.sucursal_direccion && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {item.sucursal_direccion}
                                </p>
                              )}

                              {location && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {location}
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                  Actual: {item.stock_actual}
                                </span>

                                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                                  Disponible: {item.stock_disponible}
                                </span>
                              </div>

                              <p className="mt-1 text-[11px] text-slate-500">
                                Reservado: {item.stock_reservado}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm text-slate-700">
                                {item.ubicacion || '-'}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoStockClass(
                                    item.estado_stock,
                                  )}`}
                                >
                                  {getEstadoStockLabel(item.estado_stock)}
                                </span>

                                <p
                                  className={`text-[11px] ${
                                    item.estado_inventario
                                      ? 'text-slate-500'
                                      : 'text-red-500'
                                  }`}
                                >
                                  {item.estado_inventario
                                    ? 'Inventario activo'
                                    : 'Sin inventario'}
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