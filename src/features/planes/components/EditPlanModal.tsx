import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Plan, UpdatePlanDto } from '../types/plan.types'
import { CloseIcon } from '../../../components/icons'

type EditPlanModalProps = {
  open: boolean
  plan: Plan | null
  onClose: () => void
  onSubmit: (id: number, data: UpdatePlanDto) => void | Promise<void>
  isSubmitting?: boolean
}

export function EditPlanModal({
  open,
  plan,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditPlanModalProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioMensual, setPrecioMensual] = useState('')
  const [precioAnual, setPrecioAnual] = useState('')
  const [maxSucursales, setMaxSucursales] = useState('')
  const [maxUsuarios, setMaxUsuarios] = useState('')
  const [maxProductos, setMaxProductos] = useState('')
  const [maxComprobantesMensuales, setMaxComprobantesMensuales] = useState('')
  const [incluyeSoporte, setIncluyeSoporte] = useState(false)
  const [incluyeFacturacion, setIncluyeFacturacion] = useState(false)
  const [incluyeReportes, setIncluyeReportes] = useState(false)
  const [incluyeMultiSucursal, setIncluyeMultiSucursal] = useState(false)
  const [incluyeBackup, setIncluyeBackup] = useState(false)
  const [estado, setEstado] = useState(true)
  const [activeSection, setActiveSection] = useState<
    'datos' | 'limites' | 'caracteristicas'
  >('datos')
  const [sectionError, setSectionError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !plan) return

    setNombre(plan.nombre || '')
    setDescripcion(plan.descripcion || '')
    setPrecioMensual(plan.precio_mensual ? String(plan.precio_mensual) : '')
    setPrecioAnual(plan.precio_anual ? String(plan.precio_anual) : '')
    setMaxSucursales(
      plan.max_sucursales !== null && plan.max_sucursales !== undefined
        ? String(plan.max_sucursales)
        : '',
    )
    setMaxUsuarios(
      plan.max_usuarios !== null && plan.max_usuarios !== undefined
        ? String(plan.max_usuarios)
        : '',
    )
    setMaxProductos(
      plan.max_productos !== null && plan.max_productos !== undefined
        ? String(plan.max_productos)
        : '',
    )
    setMaxComprobantesMensuales(
      plan.max_comprobantes_mensuales !== null &&
        plan.max_comprobantes_mensuales !== undefined
        ? String(plan.max_comprobantes_mensuales)
        : '',
    )
    setIncluyeSoporte(Boolean(plan.incluye_soporte))
    setIncluyeFacturacion(Boolean(plan.incluye_facturacion))
    setIncluyeReportes(Boolean(plan.incluye_reportes))
    setIncluyeMultiSucursal(Boolean(plan.incluye_multi_sucursal))
    setIncluyeBackup(Boolean(plan.incluye_backup))
    setEstado(plan.estado !== undefined ? plan.estado : true)
    setActiveSection('datos')
    setSectionError(null)
  }, [open, plan])

  if (!open || !plan) return null

  function toNumberOrNull(value: string) {
    if (!value) return null
    return Number(value)
  }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!plan) return

    onSubmit(plan.id, {
      nombre,
      descripcion,
      precio_mensual: Number(precioMensual || 0),
      precio_anual: Number(precioAnual || 0),
      max_sucursales: toNumberOrNull(maxSucursales),
      max_usuarios: toNumberOrNull(maxUsuarios),
      max_productos: toNumberOrNull(maxProductos),
      max_comprobantes_mensuales: toNumberOrNull(maxComprobantesMensuales),
      incluye_soporte: incluyeSoporte,
      incluye_facturacion: incluyeFacturacion,
      incluye_reportes: incluyeReportes,
      incluye_multi_sucursal: incluyeMultiSucursal,
      incluye_backup: incluyeBackup,
      estado,
    })
  }

  function handleSectionChange(
    section: 'datos' | 'limites' | 'caracteristicas'
  ) {
    if (section !== 'datos' && !nombre.trim()) {
      setSectionError('Completa el campo: Nombre del plan.')
      setActiveSection('datos')
      return
    }

    setSectionError(null)
    setActiveSection(section)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-medium text-slate-800">
              Editar plan
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => handleSectionChange('datos')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'datos'
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Datos del plan
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('limites')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'limites'
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Límites
              </button>
              <button
                type="button"
                onClick={() => handleSectionChange('caracteristicas')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'caracteristicas'
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Características
              </button>
            </div>
          </div>

          {activeSection === 'datos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                    Nombre del plan
                  </label>
                  <input
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    required
                    placeholder="Ej: Básico"
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                    Estado
                  </label>
                  <select
                    value={estado ? 'true' : 'false'}
                    onChange={(event) =>
                      setEstado(event.target.value === 'true')
                    }
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                    Precio mensual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={precioMensual}
                    onChange={(event) => setPrecioMensual(event.target.value)}
                    placeholder="0.00"
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                    Precio anual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={precioAnual}
                    onChange={(event) => setPrecioAnual(event.target.value)}
                    placeholder="0.00"
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(event) => setDescripcion(event.target.value)}
                  rows={3}
                  placeholder="Descripción breve del plan"
                  className="w-full resize-none rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {activeSection === 'limites' && (
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  value={maxSucursales}
                  onChange={(event) => setMaxSucursales(event.target.value)}
                  placeholder="Máx. sucursales"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />

                <input
                  type="number"
                  min="0"
                  value={maxUsuarios}
                  onChange={(event) => setMaxUsuarios(event.target.value)}
                  placeholder="Máx. usuarios"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />

                <input
                  type="number"
                  min="0"
                  value={maxProductos}
                  onChange={(event) => setMaxProductos(event.target.value)}
                  placeholder="Máx. productos"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />

                <input
                  type="number"
                  min="0"
                  value={maxComprobantesMensuales}
                  onChange={(event) =>
                    setMaxComprobantesMensuales(event.target.value)
                  }
                  placeholder="Máx. comprobantes mensuales"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Deja vacío un límite para considerarlo ilimitado.
              </p>
            </div>
          )}

          {activeSection === 'caracteristicas' && (
            <div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={incluyeSoporte}
                    onChange={(event) =>
                      setIncluyeSoporte(event.target.checked)
                    }
                  />
                  Soporte
                </label>

                <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={incluyeFacturacion}
                    onChange={(event) =>
                      setIncluyeFacturacion(event.target.checked)
                    }
                  />
                  Facturación
                </label>

                <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={incluyeReportes}
                    onChange={(event) =>
                      setIncluyeReportes(event.target.checked)
                    }
                  />
                  Reportes
                </label>

                <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={incluyeMultiSucursal}
                    onChange={(event) =>
                      setIncluyeMultiSucursal(event.target.checked)
                    }
                  />
                  Multi-sucursal
                </label>

                <label className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={incluyeBackup}
                    onChange={(event) =>
                      setIncluyeBackup(event.target.checked)
                    }
                  />
                  Backup
                </label>
              </div>
            </div>
          )}

          {sectionError && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {sectionError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
