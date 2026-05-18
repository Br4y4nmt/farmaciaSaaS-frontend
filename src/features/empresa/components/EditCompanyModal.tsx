import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useUpdateCompany } from '../hooks/useUpdateCompany'
import { CloseIcon } from '../../../components/icons'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialData?: Record<string, any>
  companyId?: number
}

export default function EditCompanyModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  companyId,
}: Props) {
  const { updateCompany, isLoading, error } = useUpdateCompany()

  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: true,
  })

  useEffect(() => {
    if (isOpen && initialData) {
      setForm((prev) => ({ ...prev, ...initialData }))
    }
    if (!isOpen) {
      setForm({ nombre: '', ruc: '', direccion: '', telefono: '', correo: '', estado: true })
    }
  }, [isOpen, initialData])

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    if (name === 'estado') {
      setForm((prev) => ({ ...prev, [name]: value === 'true' }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!companyId) return

    const res = await updateCompany(companyId, form)
    if (res) {
      onSuccess?.()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">Editar empresa</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">Nombre empresa</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">RUC</label>
                <input
                  name="ruc"
                  value={form.ruc}
                  onChange={handleChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">Teléfono empresa</label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">Dirección</label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">Correo empresa</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">Estado</label>
                <select
                  name="estado"
                  value={String(form.estado)}
                  onChange={handleChange}
                  className="rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Actualizando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
