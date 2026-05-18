import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useCreateUser } from '../hooks/useCreateUser'
import { useRoles } from '../hooks/useRoles'
import { useSucursales } from '../hooks/useSucursales'
import { CloseIcon } from '../../../components/icons'

type Props = {
  isOpen: boolean
  empresaId?: number | null
  empresaNombre?: string
  onClose: () => void
  onSuccess?: () => void
}

type FormData = {
  sucursal_id: string
  rol_id: string
  nombres: string
  apellidos: string
  correo: string
  password: string
  telefono: string
}

const initialForm: FormData = {
  sucursal_id: '',
  rol_id: '',
  nombres: '',
  apellidos: '',
  correo: '',
  password: '',
  telefono: '',
}

export default function CreateUserModal({
  isOpen,
  empresaId,
  empresaNombre,
  onClose,
  onSuccess,
}: Props) {
  const { createUser, isLoading, error } = useCreateUser()
  const { roles, isLoading: isLoadingRoles, error: rolesError } = useRoles()
  const {
    sucursales,
    isLoading: isLoadingSucursales,
    error: sucursalesError,
  } = useSucursales()

  const [form, setForm] = useState<FormData>(initialForm)
  const [activeSection, setActiveSection] = useState<'datos' | 'asignacion'>(
    'datos',
  )

  if (!isOpen) return null

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleClose() {
    setForm(initialForm)
    setActiveSection('datos')
    onClose()
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!empresaId) return

    const payload = {
      empresa_id: empresaId,
      sucursal_id: form.sucursal_id ? Number(form.sucursal_id) : null,
      rol_id: Number(form.rol_id),
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      password: form.password,
      telefono: form.telefono.trim() || null,
    }

    const response = await createUser(payload)
    if (response) {
      setForm(initialForm)
      onClose()
      onSuccess?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">Crear usuario</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveSection('datos')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'datos'
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Datos del usuario
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('asignacion')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'asignacion'
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Asignación
              </button>
            </div>
          </div>

          {activeSection === 'datos' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Nombres</label>
                  <input
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Apellidos</label>
                  <input
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'asignacion' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Empresa</label>
                  <input
                    value={empresaNombre || 'Empresa no seleccionada'}
                    disabled
                    className="rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Sucursal <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <select
                    name="sucursal_id"
                    value={form.sucursal_id}
                    onChange={handleChange}
                    disabled={isLoadingSucursales}
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="">
                      {isLoadingSucursales ? 'Cargando sucursales...' : 'Seleccionar'}
                    </option>
                    {sucursales
                      .filter((sucursal) =>
                        empresaId ? sucursal.empresa_id === empresaId : true,
                      )
                      .map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">Perfil</label>
                  <select
                    name="rol_id"
                    value={form.rol_id}
                    onChange={handleChange}
                    required
                    disabled={isLoadingRoles}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    <option value="">
                      {isLoadingRoles ? 'Cargando roles...' : 'Seleccionar'}
                    </option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {(error || rolesError || sucursalesError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error || rolesError || sucursalesError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingRoles || !empresaId}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
              
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}