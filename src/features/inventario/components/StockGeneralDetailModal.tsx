import type {
  EstadoStock,
  StockGeneral,
} from '../types/inventario.types'
import { CloseIcon } from '../../../components/icons'


type Props = {
  isOpen: boolean
  stock: StockGeneral | null
  onClose: () => void
}

export default function StockGeneralDetailModal({
  isOpen,
  stock,
  onClose,
}: Props) {
  if (!isOpen || !stock) return null

  const stockTotal = Number(stock.stock_total || 0)
  const stockReservado = Number(stock.stock_reservado || 0)
  const stockDisponible =
    stock.stock_disponible !== undefined && stock.stock_disponible !== null
      ? Number(stock.stock_disponible || 0)
      : Math.max(stockTotal - stockReservado, 0)

  const estadoStock = getEstadoStock(stock)

  function formatMoney(value: number | string | null | undefined) {
    return `S/ ${Number(value || 0).toFixed(2)}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Detalle de stock
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Información completa del producto e inventario.
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
          <div className="mb-5 rounded-sm border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">
                  {stock.nombre_comercial || stock.nombre_generico || '-'}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {stock.nombre_generico || 'Sin nombre genérico'}
                </p>
              </div>

              <span
                className={`rounded-sm px-3 py-1 text-xs font-medium ${getEstadoStockClass(
                  estadoStock,
                )}`}
              >
                {getEstadoStockLabel(estadoStock)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DetailSection title="Identificación">
              <DetailItem label="ID producto" value={stock.producto_id} />
              <DetailItem label="Código interno" value={stock.codigo || '-'} />
              <DetailItem
                label="Código de barras"
                value={stock.codigo_barras || '-'}
              />
              <DetailItem
                label="Código SUNAT"
                value={stock.codigo_sunat || '-'}
              />
            </DetailSection>

            <DetailSection title="Clasificación">
              <DetailItem label="Categoría" value={stock.categoria || '-'} />
              <DetailItem
                label="Laboratorio"
                value={stock.laboratorio || '-'}
              />
              <DetailItem label="Marca" value={stock.marca || '-'} />
              <DetailItem
                label="Unidad de medida"
                value={stock.unidad_medida || '-'}
              />
            </DetailSection>

            <DetailSection title="Inventario">
              <DetailItem label="Stock total" value={stockTotal} />
              <DetailItem label="Stock disponible" value={stockDisponible} />
              <DetailItem label="Stock reservado" value={stockReservado} />
              <DetailItem label="Stock mínimo" value={stock.stock_minimo ?? 0} />
              <DetailItem label="Stock máximo" value={stock.stock_maximo ?? 0} />
            </DetailSection>

            <DetailSection title="Precios y estado">
              <DetailItem
                label="Precio compra"
                value={formatMoney(stock.precio_compra)}
              />
              <DetailItem
                label="Precio venta"
                value={formatMoney(stock.precio_venta)}
              />
              <DetailItem
                label="Estado producto"
                value={stock.estado ? 'Activo' : 'Inactivo'}
              />
              <DetailItem
                label="Estado stock"
                value={getEstadoStockLabel(estadoStock)}
              />
            </DetailSection>
          </div>

          {stock.descripcion && (
            <div className="mt-4 rounded-sm border border-slate-200 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Descripción
              </p>

              <p className="text-sm leading-relaxed text-slate-500">
                {stock.descripcion}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function getEstadoStock(stock: StockGeneral): EstadoStock {
  const stockTotal = Number(stock.stock_total || 0)
  const stockReservado = Number(stock.stock_reservado || 0)

  const stockDisponible =
    stock.stock_disponible !== undefined && stock.stock_disponible !== null
      ? Number(stock.stock_disponible || 0)
      : Math.max(stockTotal - stockReservado, 0)

  const stockMinimo = Number(stock.stock_minimo || 0)
  const stockMaximo = Number(stock.stock_maximo || 0)

  if (stockDisponible <= 0) return 'AGOTADO'

  if (stockMinimo > 0 && stockDisponible <= stockMinimo * 0.5) {
    return 'CRITICO'
  }

  if (stockMinimo > 0 && stockDisponible <= stockMinimo) {
    return 'BAJO'
  }

  if (stockMaximo > 0 && stockDisponible >= stockMaximo) {
    return 'SOBRESTOCK'
  }

  return 'NORMAL'
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

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
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