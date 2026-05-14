import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useUpdateCompany } from '../hooks/useUpdateCompany'

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
    // for select 'estado' we receive string 'true'|'false' -> convert to boolean
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

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <header className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">Editar empresa</h3>
          <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">Cerrar</button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Datos de la empresa</h4>
          </div>

          <input name="nombre" placeholder="Nombre empresa" value={form.nombre} onChange={handleChange} required className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500" />
          <input name="ruc" placeholder="RUC" value={form.ruc} onChange={handleChange} className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500" />
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500" />
          <input name="telefono" placeholder="Teléfono empresa" value={form.telefono} onChange={handleChange} className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500" />
          <input type="email" name="correo" placeholder="Correo empresa" value={form.correo} onChange={handleChange} className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 md:col-span-2" />

          <div className="md:col-span-2">
            <label className="text-sm mb-1 block">Estado</label>
            <select name="estado" value={String(form.estado)} onChange={handleChange} className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {error && (
            <div className="md:col-span-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3 md:col-span-2">
            <button type="button" onClick={onClose} className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Cancelar</button>
            <button type="submit" disabled={isLoading} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
              {isLoading ? 'Actualizando...' : 'Actualizar empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
