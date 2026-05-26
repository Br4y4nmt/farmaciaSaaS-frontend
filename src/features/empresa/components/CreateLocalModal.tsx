import { useState } from 'react'
import { CloseIcon } from '../../../components/icons'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import { useCreateLocal } from '../hooks/useCreateLocal'
import {
  showSuccessToast,
  showErrorToast,
} from '../../../components/ui/toast'

type CreateLocalModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
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

export function CreateLocalModal({
  isOpen,
  onClose,
  onCreated,
}: CreateLocalModalProps) {
  const { createLocal, isLoading } = useCreateLocal()
  const [form, setForm] = useState(initialForm)

  if (!isOpen) return null

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
    // Validar que el teléfono tenga exactamente 9 dígitos numéricos
    const telefonoDigits = form.telefono.replace(/\D/g, '')
    if (telefonoDigits.length !== 9) {
      showErrorToast(
        'Teléfono inválido',
        'El teléfono debe contener exactamente 9 dígitos numéricos.',
      )

      return
    }

    const response = await createLocal({
      nombre: form.nombre.trim(),
      direccion_fiscal: form.direccion_fiscal.trim(),
      direccion_comercial: form.direccion_comercial.trim(),
      departamento: form.departamento.trim(),
      provincia: form.provincia.trim(),
      distrito: form.distrito.trim(),
      telefono: telefonoDigits,
      correo_contacto: form.correo_contacto.trim(),
      responsable: form.responsable.trim(),
      estado: form.estado,
    })

    if (!response) {
      showErrorToast(
        'No se pudo crear la sucursal',
        'Verifica los datos e inténtalo nuevamente',
      )

      return
    }

    setForm(initialForm)
    onCreated?.()
    onClose()

    setTimeout(() => {
      showSuccessToast(
        'Sucursal creada correctamente',
        'La sucursal fue registrada con éxito',
      )
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-5xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-medium text-slate-800">
              Nueva sucursal
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
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
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                required
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
                required
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
                required
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
                type="tel"
                required
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                <div className="flex items-center gap-1.5">
                  <span>Dirección fiscal</span>
                  <InfoTooltip text="Dirección utilizada en documentos fiscales (facturación). Ejemplo: Av. Principal 123, Oficina 4(puede ser su domicilio)." />
                </div>
              </label>

              <input
                name="direccion_fiscal"
                value={form.direccion_fiscal}
                onChange={handleChange}
                type="text"
                required
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                <div className="flex items-center gap-1.5">
                  <span>Dirección comercial</span>
                  <InfoTooltip text="Dirección donde opera la sucursal (tienda fisica). Ejemplo: Calle Secundaria 45, Local 2." />
                </div>
              </label>

              <input
                name="direccion_comercial"
                value={form.direccion_comercial}
                onChange={handleChange}
                type="text"
                required
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
                required
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
                required
                className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-end">
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

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLocalModal