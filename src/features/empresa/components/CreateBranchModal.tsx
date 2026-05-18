import { useState } from 'react'
import { useCreateSucursal } from '../hooks/useCreateSucursal'
import { useEmpresas } from '../hooks/useEmpresas'
import { CloseIcon } from '../../../components/icons'

type CreateBranchModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

const initialForm = {
  empresa_id: '',
  nombre: '',
  codigo: '',
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

export function CreateBranchModal({
  isOpen,
  onClose,
  onCreated,
}: CreateBranchModalProps) {
  const { createSucursal, isLoading, error } = useCreateSucursal()
  const { empresas, isLoading: loadingEmpresas } = useEmpresas()

  const [form, setForm] = useState(initialForm)

  if (!isOpen) return null

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    const response = await createSucursal({
      empresa_id: Number(form.empresa_id),
      nombre: form.nombre.trim(),
      codigo: form.codigo.trim(),
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

    setForm(initialForm)
    onCreated?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-5xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-medium text-slate-800">
            Nueva sucursal
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Empresa
              </label>

              <select
                name="empresa_id"
                value={form.empresa_id}
                onChange={handleChange}
                required
                disabled={loadingEmpresas}
                className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {loadingEmpresas ? 'Cargando empresas...' : 'Seleccionar empresa'}
                </option>

                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                Nombre de sucursal
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
                Código
              </label>
              <input
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                type="text"
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
                Sucursal activa
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
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading || loadingEmpresas}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBranchModal