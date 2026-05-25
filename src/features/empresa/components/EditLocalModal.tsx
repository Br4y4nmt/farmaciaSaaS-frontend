import { useEffect, useState } from 'react'
import { CloseIcon } from '../../../components/icons'
import type { Sucursal } from '../types/empresa.types'
import { useUpdateLocal } from '../hooks/useUpdateLocal'

type EditLocalModalProps = {
  isOpen: boolean
  sucursal: Sucursal | null
  onClose: () => void
  onUpdated?: () => void
}

const initialForm = {
  nombre: '',
  direccion_fiscal: '',
  direccion_comercial: '',
  departamento: '',
  provincia: '',
  distrito: '',
  telefono: '',
  correo_contacto: '',
  responsable: '',
  estado: true,
}

export function EditLocalModal({
  isOpen,
  sucursal,
  onClose,
  onUpdated,
}: EditLocalModalProps) {
  const [form, setForm] = useState(initialForm)
  const { updateLocal, isLoading, error } = useUpdateLocal()

  useEffect(() => {
    if (sucursal) {
      setForm({
        nombre: sucursal.nombre ?? '',
        direccion_fiscal: sucursal.direccion_fiscal ?? '',
        direccion_comercial: sucursal.direccion_comercial ?? '',
        departamento: sucursal.departamento ?? '',
        provincia: sucursal.provincia ?? '',
        distrito: sucursal.distrito ?? '',
        telefono: sucursal.telefono ?? '',
        correo_contacto: sucursal.correo_contacto ?? '',
        responsable: sucursal.responsable ?? '',
        estado: sucursal.estado ?? true,
      })
    }
  }, [sucursal])

  if (!isOpen || !sucursal) return null

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : value,
    }))
  }

  function handleClose() {
    setForm(initialForm)
    onClose()
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!sucursal) return

    const response = await updateLocal(sucursal.id, {
      nombre: form.nombre.trim(),
      direccion_fiscal: form.direccion_fiscal.trim(),
      direccion_comercial: form.direccion_comercial.trim(),
      departamento: form.departamento.trim(),
      provincia: form.provincia.trim(),
      distrito: form.distrito.trim(),
      telefono: form.telefono.trim(),
      correo_contacto: form.correo_contacto.trim(),
      responsable: form.responsable.trim(),
      estado: form.estado,
    })

    if (!response) return

    onUpdated?.()
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-5xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-medium text-slate-800">
              Editar sucursal
            </h2>

          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Nombre del local / sucursal
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                type="text"
                required
                placeholder="Ej: Botica Central"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Código
              </label>
              <input
                value={sucursal.codigo || '-'}
                type="text"
                disabled
                className="h-9 w-full cursor-not-allowed rounded border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Departamento
              </label>
              <input
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                type="text"
                placeholder="Ej: Huánuco"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Provincia
              </label>
              <input
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                type="text"
                placeholder="Ej: Huánuco"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Distrito
              </label>
              <input
                name="distrito"
                value={form.distrito}
                onChange={handleChange}
                type="text"
                placeholder="Ej: Amarilis"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Dirección fiscal
              </label>
              <input
                name="direccion_fiscal"
                value={form.direccion_fiscal}
                onChange={handleChange}
                type="text"
                placeholder="Dirección fiscal del local"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Dirección comercial
              </label>
              <input
                name="direccion_comercial"
                value={form.direccion_comercial}
                onChange={handleChange}
                type="text"
                placeholder="Dirección donde atiende el local"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Teléfono
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                type="text"
                placeholder="Ej: 987654321"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Correo de contacto
              </label>
              <input
                name="correo_contacto"
                value={form.correo_contacto}
                onChange={handleChange}
                type="email"
                placeholder="local@empresa.com"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Responsable
              </label>
              <input
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                type="text"
                placeholder="Nombre del encargado"
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="flex items-center gap-2 text-[13px] font-medium text-[#606266]">
                <input
                  name="estado"
                  checked={form.estado}
                  onChange={handleChange}
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                />
                Local activo
              </label>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Actualizando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLocalModal