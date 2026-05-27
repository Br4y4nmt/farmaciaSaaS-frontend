import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../../services/api'
import { showError, showSuccess } from '../../../components/ui/sonner'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import type { StockGeneral } from '../types/inventario.types'
import { CloseIcon } from '../../../components/icons'

type TipoAjuste = 'ENTRADA' | 'SALIDA'

type SucursalOption = {
  sucursal_id: number
  sucursal_codigo: string | null
  sucursal_nombre: string
  sucursal_direccion: string | null
  sucursal_departamento?: string | null
  sucursal_provincia?: string | null
  sucursal_distrito?: string | null
  stock_actual: number
  stock_reservado: number
  stock_disponible: number
  ubicacion: string | null
}

type GetStockPorSucursalResponse = {
  sucursales: SucursalOption[]
}

type Props = {
  isOpen: boolean
  stock: StockGeneral | null
  onClose: () => void
  onSuccess?: () => void
}

export default function AjustarStockModal({
  isOpen,
  stock,
  onClose,
  onSuccess,
}: Props) {
  const [sucursales, setSucursales] = useState<SucursalOption[]>([])
  const [isLoadingSucursales, setIsLoadingSucursales] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [sucursalId, setSucursalId] = useState('')
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjuste>('ENTRADA')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')
  const [observacion, setObservacion] = useState('')
  const [ubicacion, setUbicacion] = useState('')

  const selectedSucursal = sucursales.find(
    (item) => String(item.sucursal_id) === sucursalId,
  )

  const stockActual = Number(selectedSucursal?.stock_actual || 0)
  const cantidadNumber = Number(cantidad || 0)

  const stockNuevo =
    tipoAjuste === 'ENTRADA'
      ? stockActual + cantidadNumber
      : stockActual - cantidadNumber

  useEffect(() => {
    if (!isOpen || !stock?.producto_id) return

    resetForm()
    fetchSucursales(stock.producto_id)
  }, [isOpen, stock?.producto_id])

  async function fetchSucursales(productoId: number) {
    try {
      setIsLoadingSucursales(true)

      const response = await api.get('/inventario/stock-por-sucursal', {
        params: {
          producto_id: productoId,
        },
      })

      const data: GetStockPorSucursalResponse = response.data.data
      const sucursalesData = data.sucursales || []

      setSucursales(sucursalesData)

      if (sucursalesData.length > 0) {
        const firstSucursal = sucursalesData[0]

        setSucursalId(String(firstSucursal.sucursal_id))
        setUbicacion(firstSucursal.ubicacion || '')
      }
    } catch (error: any) {
      console.error(error)

      const message =
        error.response?.data?.message ||
        'No se pudieron cargar las sucursales del producto'

      showError(message)
      setSucursales([])
    } finally {
      setIsLoadingSucursales(false)
    }
  }

  function resetForm() {
    setSucursales([])
    setSucursalId('')
    setTipoAjuste('ENTRADA')
    setCantidad('')
    setMotivo('')
    setObservacion('')
    setUbicacion('')
  }

  function handleSucursalChange(value: string) {
    setSucursalId(value)

    const sucursal = sucursales.find(
      (item) => String(item.sucursal_id) === value,
    )

    setUbicacion(sucursal?.ubicacion || '')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stock?.producto_id) {
      showError('No se encontró el producto seleccionado')
      return
    }

    if (!sucursalId) {
      showError('Selecciona una sucursal')
      return
    }

    if (!cantidadNumber || cantidadNumber <= 0) {
      showError('La cantidad debe ser mayor a 0')
      return
    }

    if (tipoAjuste === 'SALIDA' && stockNuevo < 0) {
      showError('No puedes retirar más stock del disponible en la sucursal')
      return
    }

    if (!motivo.trim()) {
      showError('El motivo es obligatorio')
      return
    }

    try {
      setIsSaving(true)

      await api.post('/inventario/ajustar-stock', {
        producto_id: stock.producto_id,
        sucursal_id: Number(sucursalId),
        tipo_ajuste: tipoAjuste,
        cantidad: cantidadNumber,
        motivo: motivo.trim(),
        observacion: observacion.trim() || null,
        ubicacion: ubicacion.trim() || null,
      })

      showSuccess('Stock ajustado correctamente')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error(error)

      const message =
        error.response?.data?.message || 'No se pudo ajustar el stock'

      showError(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !stock) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Ajustar stock
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Registra una entrada o salida manual del inventario.
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
            <p className="text-base font-semibold text-slate-900">
              {stock.nombre_comercial || stock.nombre_generico || '-'}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {stock.nombre_generico || 'Sin nombre genérico'}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                Código: {stock.codigo || '-'}
              </span>

              <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                Unidad: {stock.unidad_medida || '-'}
              </span>

              <span className="rounded bg-white px-2.5 py-1 text-slate-600">
                Stock general: {stock.stock_total || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel
                label="Sucursal"
                info="Selecciona la sucursal donde se realizará el ajuste. El stock se modifica solo en esa sucursal, no en todas."
              />

              <select
                required
                value={sucursalId}
                onChange={(e) => handleSucursalChange(e.target.value)}
                disabled={isLoadingSucursales}
                className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
              >
                <option value="">
                  {isLoadingSucursales
                    ? 'Cargando sucursales...'
                    : 'Seleccionar sucursal'}
                </option>

                {sucursales.map((item) => (
                  <option key={item.sucursal_id} value={item.sucursal_id}>
                    {item.sucursal_nombre} - Stock actual: {item.stock_actual}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel
                label="Tipo de ajuste"
                info="Entrada de stock aumenta la cantidad disponible. Salida de stock disminuye la cantidad. Usa este ajuste solo para correcciones manuales, no para compras o ventas normales."
              />

              <select
                required
                value={tipoAjuste}
                onChange={(e) => setTipoAjuste(e.target.value as TipoAjuste)}
                className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="ENTRADA">Entrada de stock</option>
                <option value="SALIDA">Salida de stock</option>
              </select>
            </div>

            <div>
              <FieldLabel
                label="Cantidad"
                info="Cantidad que se sumará o restará al stock actual de la sucursal seleccionada. Debe ser mayor a 0."
              />

              <input
                required
                type="number"
                min={1}
                step={1}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Ej: 5"
              />
            </div>

            <div>
              <FieldLabel
                label="Stock actual"
                info="Stock registrado actualmente en la sucursal seleccionada antes de aplicar el ajuste."
              />

              <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
                {stockActual}
              </div>
            </div>

            <div>
              <FieldLabel
                label="Stock nuevo"
                info="Resultado calculado automáticamente después de aplicar la entrada o salida de stock."
              />

              <div
                className={`rounded-sm border px-3 py-2 text-sm font-semibold ${
                  stockNuevo < 0
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                {cantidad ? stockNuevo : stockActual}
              </div>
            </div>

            <div className="md:col-span-2">
              <FieldLabel
                label="Ubicación"
                info="Lugar físico donde se encuentra el producto dentro de la sucursal. Ejemplo: Estante A1, almacén, vitrina o mostrador."
              />

              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Ej: Estante A1, almacén, vitrina..."
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel
                label="Motivo del ajuste"
                info="Explica por qué se está modificando el stock. Este dato es obligatorio y quedará registrado en el Kardex."
              />

              <input
                required
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Ej: Diferencia por conteo físico"
              />
            </div>

            <div className="md:col-span-2">
              <FieldLabel
                label="Observación"
                info="Campo opcional para agregar más detalle sobre el ajuste. Ejemplo: Se encontraron 2 unidades dañadas durante el conteo."
              />

              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Detalle adicional del ajuste..."
              />
            </div>
          </div>

          {selectedSucursal && (
            <div className="mt-5 rounded-sm border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <p className="text-sm font-semibold text-slate-700">
                  Resumen de sucursal
                </p>

                <InfoTooltip text="Resumen rápido del inventario actual en la sucursal seleccionada antes de guardar el ajuste." />
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <ResumenMini
                  label="Actual"
                  value={selectedSucursal.stock_actual}
                  info="Stock total registrado actualmente en esta sucursal."
                />

                <ResumenMini
                  label="Disponible"
                  value={selectedSucursal.stock_disponible}
                  info="Stock que puede venderse o usarse. Normalmente es stock actual menos stock reservado."
                />

                <ResumenMini
                  label="Reservado"
                  value={selectedSucursal.stock_reservado}
                  info="Stock separado o comprometido, por ejemplo para pedidos pendientes."
                />

                <ResumenMini
                  label="Ubicación"
                  value={selectedSucursal.ubicacion || '-'}
                  info="Ubicación física registrada para este producto en esta sucursal."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving || isLoadingSucursales}
            className="cursor-pointer rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldLabel({
  label,
  info,
}: {
  label: string
  info?: string
}) {
  return (
    <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {info && <InfoTooltip text={info} />}
    </label>
  )
}

function ResumenMini({
  label,
  value,
  info,
}: {
  label: string
  value: string | number
  info?: string
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white px-3 py-2">
      <div className="flex items-center gap-1.5">
        <p className="text-[11px] text-slate-500">{label}</p>
        {info && <InfoTooltip text={info} />}
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}