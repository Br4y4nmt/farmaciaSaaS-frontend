import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

import { CloseIcon } from '../../../components/icons'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'

import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { useProveedores } from '../../proveedor/hooks/useProveedores'
import { useProductos } from '../../producto/hooks/useProductos'
import { useLocales } from '../../empresa/hooks/useLocales'
import { useCreateCompra } from '../hooks/useCreateCompra'

import type { TipoComprobante } from '../types/compra.types'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type ActiveSection = 'datos' | 'productos' | 'resumen'

type CompraForm = {
  proveedor_id: string
  sucursal_id: string
  tipo_comprobante: string
  serie: string
  numero: string
  fecha_emision: string
  fecha_recepcion: string
  observacion: string
  afecto_igv: boolean
}

type CompraDetalleForm = {
  producto_id: string
  cantidad: string
  costo_unitario: string
  lote: string
  fecha_vencimiento: string
}

const initialForm: CompraForm = {
  proveedor_id: '',
  sucursal_id: '',
  tipo_comprobante: 'FACTURA',
  serie: '',
  numero: '',
  fecha_emision: new Date().toISOString().slice(0, 10),
  fecha_recepcion: new Date().toISOString().slice(0, 10),
  observacion: '',
  afecto_igv: true,
}

const initialDetalle: CompraDetalleForm = {
  producto_id: '',
  cantidad: '',
  costo_unitario: '',
  lote: '',
  fecha_vencimiento: '',
}

export default function CreateCompraModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const user = useStoredUser()

  const [form, setForm] = useState<CompraForm>({
    ...initialForm,
    sucursal_id: user?.sucursal_id ? String(user.sucursal_id) : '',
  })

  const [detalles, setDetalles] = useState<CompraDetalleForm[]>([
    { ...initialDetalle },
  ])

  const [activeSection, setActiveSection] = useState<ActiveSection>('datos')
  const [error, setError] = useState<string | null>(null)

  const { proveedores, isLoading: isLoadingProveedores } = useProveedores()
  const { productos, isLoading: isLoadingProductos } = useProductos()
  const { locales, isLoading: isLoadingLocales } = useLocales()

  const {
    crearCompra,
    isLoading: isCreatingCompra,
    error: createCompraError,
    setError: setCreateCompraError,
  } = useCreateCompra()

  const subtotal = useMemo(() => {
    return detalles.reduce((total, item) => {
      const cantidad = Number(item.cantidad || 0)
      const costo = Number(item.costo_unitario || 0)

      return total + cantidad * costo
    }, 0)
  }, [detalles])

  const igv = useMemo(() => {
    if (!form.afecto_igv) return 0
    return subtotal * 0.18
  }, [subtotal, form.afecto_igv])

  const total = useMemo(() => {
    return subtotal + igv
  }, [subtotal, igv])

  if (!isOpen) return null

  function resetForm() {
    setForm({
      ...initialForm,
      sucursal_id: user?.sucursal_id ? String(user.sucursal_id) : '',
    })

    setDetalles([{ ...initialDetalle }])
    setActiveSection('datos')
    setError(null)
    setCreateCompraError(null)
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target

    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (error) setError(null)
    if (createCompraError) setCreateCompraError(null)
  }

  function handleDetalleChange(
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target

    setDetalles((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [name]: value,
            }
          : item,
      ),
    )

    if (error) setError(null)
    if (createCompraError) setCreateCompraError(null)
  }

  function handleAddDetalle() {
    setDetalles((prev) => [...prev, { ...initialDetalle }])
  }

  function handleRemoveDetalle(index: number) {
    setDetalles((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, currentIndex) => currentIndex !== index)
    })
  }

  function handleSectionChange(section: ActiveSection) {
    setError(null)
    setActiveSection(section)
  }

  function getProductoNombre(productoId: string) {
    const producto = productos.find((item) => String(item.id) === productoId)

    if (!producto) return '-'

    return producto.nombre_comercial || producto.nombre_generico || '-'
  }

  function validateForm(): {
    section: ActiveSection
    message: string
  } | null {
    if (!user?.empresa_id) {
      return {
        section: 'datos',
        message: 'No se encontró la empresa del usuario autenticado.',
      }
    }

    if (!form.proveedor_id) {
      return {
        section: 'datos',
        message: 'Selecciona un proveedor.',
      }
    }

    if (!form.sucursal_id) {
      return {
        section: 'datos',
        message: 'Selecciona una sucursal.',
      }
    }

    if (!form.tipo_comprobante.trim()) {
      return {
        section: 'datos',
        message: 'Selecciona el tipo de comprobante.',
      }
    }

    if (!form.fecha_emision) {
      return {
        section: 'datos',
        message: 'Selecciona la fecha de emisión.',
      }
    }

    if (!form.fecha_recepcion) {
      return {
        section: 'datos',
        message: 'Selecciona la fecha de recepción.',
      }
    }

    if (detalles.length === 0) {
      return {
        section: 'productos',
        message: 'Agrega al menos un producto a la compra.',
      }
    }

    for (let i = 0; i < detalles.length; i++) {
      const item = detalles[i]
      const row = i + 1

      if (!item.producto_id) {
        return {
          section: 'productos',
          message: `Selecciona un producto en la fila ${row}.`,
        }
      }

      if (!item.cantidad.trim()) {
        return {
          section: 'productos',
          message: `Completa la cantidad en la fila ${row}.`,
        }
      }

      if (!Number.isInteger(Number(item.cantidad))) {
        return {
          section: 'productos',
          message: `La cantidad en la fila ${row} debe ser un número entero.`,
        }
      }

      if (Number(item.cantidad) <= 0) {
        return {
          section: 'productos',
          message: `La cantidad en la fila ${row} debe ser mayor a 0.`,
        }
      }

      if (!item.costo_unitario.trim()) {
        return {
          section: 'productos',
          message: `Completa el costo unitario en la fila ${row}.`,
        }
      }

      if (Number(item.costo_unitario) < 0) {
        return {
          section: 'productos',
          message: `El costo unitario en la fila ${row} no puede ser negativo.`,
        }
      }

      if (!item.lote.trim()) {
        return {
          section: 'productos',
          message: `Completa el lote en la fila ${row}.`,
        }
      }

      if (!item.fecha_vencimiento) {
        return {
          section: 'productos',
          message: `Selecciona la fecha de vencimiento en la fila ${row}.`,
        }
      }
    }

    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setActiveSection(validationError.section)
      setError(validationError.message)
      return
    }

    const payload = {
      sucursal_id: Number(form.sucursal_id),
      proveedor_id: Number(form.proveedor_id),

      tipo_comprobante: form.tipo_comprobante as TipoComprobante,
      serie: form.serie.trim(),
      numero: form.numero.trim(),

      fecha_emision: form.fecha_emision,
      fecha_recepcion: form.fecha_recepcion,

      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      total: Number(total.toFixed(2)),

      observacion: form.observacion.trim(),

      detalles: detalles.map((item) => ({
        producto_id: Number(item.producto_id),
        cantidad: Number(item.cantidad),
        costo_unitario: Number(item.costo_unitario),
        subtotal: Number(
          (
            Number(item.cantidad || 0) * Number(item.costo_unitario || 0)
          ).toFixed(2),
        ),
        lote: item.lote.trim(),
        fecha_vencimiento: item.fecha_vencimiento,
      })),
    }

    const compra = await crearCompra(payload)

    if (!compra) return

    resetForm()
    onClose()
    onSuccess?.()
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-5xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">Nueva compra</h3>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6 overflow-x-auto">
              <TabButton
                label="Datos de compra"
                active={activeSection === 'datos'}
                onClick={() => handleSectionChange('datos')}
              />

              <TabButton
                label="Productos"
                active={activeSection === 'productos'}
                onClick={() => handleSectionChange('productos')}
              />

              <TabButton
                label="Resumen"
                active={activeSection === 'resumen'}
                onClick={() => handleSectionChange('resumen')}
              />
            </div>
          </div>

          {activeSection === 'datos' && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Proveedor"
                name="proveedor_id"
                value={form.proveedor_id}
                onChange={handleChange}
                disabled={isLoadingProveedores}
                info="Selecciona la empresa o droguería a la que le estás comprando la mercadería."
                options={[
                  [
                    '',
                    isLoadingProveedores
                      ? 'Cargando proveedores...'
                      : 'Seleccionar proveedor',
                  ],
                  ...proveedores.map((proveedor) => [
                    String(proveedor.id),
                    proveedor.nombre_comercial ||
                      proveedor.razon_social ||
                      `Proveedor #${proveedor.id}`,
                  ] as [string, string]),
                ]}
              />

              <Select
                label="Sucursal"
                name="sucursal_id"
                value={form.sucursal_id}
                onChange={handleChange}
                disabled={isLoadingLocales}
                info="Selecciona el local donde ingresará el stock de esta compra."
                options={[
                  [
                    '',
                    isLoadingLocales
                      ? 'Cargando sucursales...'
                      : 'Seleccionar sucursal',
                  ],
                  ...locales.map((local) => [
                    String(local.id),
                    local.nombre,
                  ] as [string, string]),
                ]}
              />

              <Select
                label="Tipo de comprobante"
                name="tipo_comprobante"
                value={form.tipo_comprobante}
                onChange={handleChange}
                info="Documento entregado por el proveedor: factura, boleta, guía, ticket u otro."
                options={[
                  ['FACTURA', 'Factura'],
                  ['BOLETA', 'Boleta'],
                  ['GUIA', 'Guía'],
                  ['TICKET', 'Ticket'],
                  ['OTRO', 'Otro'],
                ]}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Serie"
                  name="serie"
                  value={form.serie}
                  onChange={handleChange}
                  info="Parte inicial del comprobante. Ejemplo: F001, B001 o T001."
                />

                <Input
                  label="Número"
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                  info="Número correlativo del comprobante. Ejemplo: 000123."
                />
              </div>

              <Input
                type="date"
                label="Fecha de emisión"
                name="fecha_emision"
                value={form.fecha_emision}
                onChange={handleChange}
                info="Fecha en la que el proveedor emitió la factura, boleta o documento."
              />

              <Input
                type="date"
                label="Fecha de recepción"
                name="fecha_recepcion"
                value={form.fecha_recepcion}
                onChange={handleChange}
                info="Fecha en la que la mercadería ingresa físicamente al stock."
              />

              <div className="col-span-2 flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
                  <span>Observación</span>
                  <InfoTooltip text="Comentario opcional sobre la compra. Ejemplo: mercadería recibida completa, compra con descuento o entrega parcial." />
                </label>

                <textarea
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  rows={3}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <Checkbox
                label="Afecto a IGV"
                name="afecto_igv"
                checked={form.afecto_igv}
                onChange={handleChange}
                info="Marca esta opción si la compra incluye IGV. El sistema calculará el 18% sobre el subtotal."
              />
            </div>
          )}

          {activeSection === 'productos' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-medium text-slate-500">
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Producto"
                          info="Producto que estás comprando y que ingresará al inventario."
                        />
                      </th>
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Cantidad"
                          info="Número de unidades que estás recibiendo. Esta cantidad aumentará el stock."
                        />
                      </th>
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Costo unitario"
                          info="Costo de compra por cada unidad. Ejemplo: si una unidad cuesta S/ 0.50, escribe 0.50."
                        />
                      </th>
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Lote"
                          info="Código del lote impreso en el producto o caja. Ejemplo: L240501, ABC123 o SIN-LOTE si no lo tienes."
                        />
                      </th>
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Vencimiento"
                          info="Fecha de vencimiento del lote. Es importante para alertas de productos por vencer."
                        />
                      </th>
                      <th className="px-3 py-2">
                        <TableHeaderTooltip
                          label="Subtotal"
                          info="Cálculo automático: cantidad por costo unitario."
                        />
                      </th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {detalles.map((item, index) => {
                      const cantidad = Number(item.cantidad || 0)
                      const costo = Number(item.costo_unitario || 0)
                      const itemSubtotal = cantidad * costo

                      return (
                        <tr key={index} className="border-t border-slate-200">
                          <td className="px-3 py-2">
                            <select
                              name="producto_id"
                              value={item.producto_id}
                              onChange={(e) => handleDetalleChange(index, e)}
                              disabled={isLoadingProductos}
                              className="w-full cursor-pointer rounded border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                              <option value="">
                                {isLoadingProductos
                                  ? 'Cargando productos...'
                                  : 'Seleccionar producto'}
                              </option>

                              {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                  {producto.nombre_comercial ||
                                    producto.nombre_generico ||
                                    `Producto #${producto.id}`}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="number"
                              name="cantidad"
                              value={item.cantidad}
                              onChange={(e) => handleDetalleChange(index, e)}
                              min="1"
                              step="1"
                              placeholder="Ej: 100"
                              className="w-24 rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="number"
                              name="costo_unitario"
                              value={item.costo_unitario}
                              onChange={(e) => handleDetalleChange(index, e)}
                              min="0"
                              step="0.01"
                              placeholder="Ej: 0.50"
                              className="w-32 rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="text"
                              name="lote"
                              value={item.lote}
                              onChange={(e) => handleDetalleChange(index, e)}
                              placeholder="Ej: L240501"
                              className="w-32 rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="date"
                              name="fecha_vencimiento"
                              value={item.fecha_vencimiento}
                              onChange={(e) => handleDetalleChange(index, e)}
                              className="w-40 rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            />
                          </td>

                          <td className="px-3 py-2 font-medium text-slate-700">
                            S/ {itemSubtotal.toFixed(2)}
                          </td>

                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveDetalle(index)}
                              disabled={detalles.length === 1}
                              className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleAddDetalle}
                className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                + Agregar producto
              </button>
            </div>
          )}

          {activeSection === 'resumen' && (
            <div className="grid grid-cols-3 gap-4">
              <SummaryCard
                label="Subtotal"
                value={`S/ ${subtotal.toFixed(2)}`}
              />
              <SummaryCard label="IGV" value={`S/ ${igv.toFixed(2)}`} />
              <SummaryCard label="Total" value={`S/ ${total.toFixed(2)}`} />

              <div className="col-span-3 overflow-x-auto rounded border border-slate-200">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-medium text-slate-500">
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2">Cantidad</th>
                      <th className="px-3 py-2">Costo</th>
                      <th className="px-3 py-2">Lote</th>
                      <th className="px-3 py-2">Vencimiento</th>
                      <th className="px-3 py-2">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detalles.map((item, index) => {
                      const cantidad = Number(item.cantidad || 0)
                      const costo = Number(item.costo_unitario || 0)

                      return (
                        <tr key={index} className="border-t border-slate-200">
                          <td className="px-3 py-2">
                            {getProductoNombre(item.producto_id)}
                          </td>
                          <td className="px-3 py-2">{cantidad}</td>
                          <td className="px-3 py-2">S/ {costo.toFixed(2)}</td>
                          <td className="px-3 py-2">{item.lote || '-'}</td>
                          <td className="px-3 py-2">
                            {item.fecha_vencimiento || '-'}
                          </td>
                          <td className="px-3 py-2 font-medium">
                            S/ {(cantidad * costo).toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(error || createCompraError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error || createCompraError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreatingCompra}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingCompra ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-sky-600 text-sky-600'
          : 'text-slate-500'
      }`}
    >
      {label}
    </button>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  info,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  info?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
        <span>{label}</span>
        {info && <InfoTooltip text={info} />}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
  )
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  info,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: [string, string][]
  disabled?: boolean
  info?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
        <span>{label}</span>
        {info && <InfoTooltip text={info} />}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
  info,
}: {
  label: string
  name: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  info?: string
}) {
  return (
    <label className="flex items-center gap-3 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
      />

      <span className="flex items-center gap-1.5">
        <span>{label}</span>
        {info && <InfoTooltip text={info} />}
      </span>
    </label>
  )
}

function TableHeaderTooltip({
  label,
  info,
}: {
  label: string
  info: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <InfoTooltip text={info} />
    </div>
  )
}

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  )
}