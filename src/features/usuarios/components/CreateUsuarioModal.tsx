import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '../../../components/icons'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import TextField from '../../../components/form/TextField'
import PhoneField from '../../../components/form/PhoneField'
import { useRolesAdminEmpresa } from '../hooks/useRolesAdminEmpresa'
import { usePermisosByRol } from '../hooks/usePermisosByRol'
import { useLocales } from '../../empresa/hooks/useLocales'
import { useCreateUsuario } from '../hooks/useCreateUsuario'
import { showSuccessToast } from '../../../components/ui/toast'

type CreateUsuarioModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

type ActiveTab = 'usuario' | 'asignacion' | 'permisos'

const initialForm = {
  nombres: '',
  apellidos: '',
  correo: '',
  password: '',
  telefono: '',
  rol_id: '',
  sucursal_id: '',
  estado: true,
}

export function CreateUsuarioModal({
  isOpen,
  onClose,
  onCreated,
}: CreateUsuarioModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('usuario')
  const [form, setForm] = useState(initialForm)
  const formRef = useRef<HTMLFormElement | null>(null)
  const [pendingReportValidity, setPendingReportValidity] = useState(false)

  const {
    roles,
    isLoading: loadingRoles,
    error: rolesError,
  } = useRolesAdminEmpresa()

  const { locales: sucursales, isLoading: isLoadingLocales } = useLocales()

  const {
    permisos,
    isLoading: loadingPermisos,
    error: permisosError,
  } = usePermisosByRol(form.rol_id)

  const {
    createUsuario,
    isLoading: creatingUsuario,
    error: createError,
    } = useCreateUsuario()

  const selectedRol = roles.find((rol) => String(rol.id) === form.rol_id)

  useEffect(() => {
    if (!pendingReportValidity) return

    const timer = window.setTimeout(() => {
      formRef.current?.reportValidity()
      setPendingReportValidity(false)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [activeTab, pendingReportValidity])

  if (!isOpen) return null

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target
    const newValue: any = value

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : newValue,
    }))
  }

  function handleSectionChange(section: ActiveTab) {
    // if moving forward from 'usuario', ensure required fields are valid
    if (activeTab === 'usuario' && section !== 'usuario') {
      const formElement = formRef.current

      if (formElement && !formElement.reportValidity()) {
        return
      }
    }

    setActiveTab(section)
  }

    function handleClose() {
    if (creatingUsuario) return

    setForm(initialForm)
    setActiveTab('usuario')
    onClose()
    }

        async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const incomplete = getFirstIncompleteSection()

        if (incomplete) {
            setActiveTab(incomplete)
            setPendingReportValidity(true)
            return
        }

        const response = await createUsuario({
            nombres: form.nombres.trim(),
            apellidos: form.apellidos.trim(),
            correo: form.correo.trim().toLowerCase(),
            password: form.password.trim(),
            telefono: form.telefono.trim() || null,
            rol_id: Number(form.rol_id),
            sucursal_id: Number(form.sucursal_id),
            estado: form.estado,
        })

        if (!response) return

        showSuccessToast('Usuario creado', 'El usuario fue registrado correctamente.')

        setForm(initialForm)
        setActiveTab('usuario')
        onCreated?.()
        onClose()
        }

  function getFirstIncompleteSection(): ActiveTab | null {
    if (
      !form.nombres.trim() ||
      !form.apellidos.trim() ||
      !form.correo.trim() ||
      !form.password.trim() ||
      String(form.telefono).replace(/\D/g, '').length !== 9
    ) {
      return 'usuario'
    }

    if (!form.rol_id || !form.sucursal_id) {
      return 'asignacion'
    }

    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-3xl rounded-sm border border-slate-200 bg-white shadow-xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-medium text-slate-800">
            Nuevo usuario
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="px-4 pb-4">
          <div className="border-b border-slate-200">
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => handleSectionChange('usuario')}
                className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'usuario'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Datos de Usuario
              </button>

              <button
                type="button"
                onClick={() => handleSectionChange('asignacion')}
                className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'asignacion'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Asignación
              </button>

              <button
                type="button"
                onClick={() => handleSectionChange('permisos')}
                className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  activeTab === 'permisos'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Permisos
              </button>
            </div>
          </div>

          <div className="min-h-[260px] py-4">
            {activeTab === 'usuario' && (
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Información de acceso y datos personales
                </h3>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Nombres <span className="text-red-500">*</span>
                    </label>
                    <TextField
                      name="nombres"
                      value={form.nombres}
                      onChange={handleChange}
                      type="text"
                      sanitize="letters-only"
                      required
                      disabled={creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Apellidos <span className="text-red-500">*</span>
                    </label>
                    <TextField
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      type="text"
                      sanitize="letters-only"
                      required
                      disabled={creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Correo electrónico
                    </label>
                    <input
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      type="email"
                      required
                      disabled={creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Contraseña
                    </label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      required
                      disabled={creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Teléfono
                    </label>
                    <PhoneField
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                      disabled={creatingUsuario}
                      title="Ingrese 9 dígitos (solo números)"
                      className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'asignacion' && (
              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Asignación del usuario dentro de la empresa
                </h3>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
                      <span>Rol</span>
                      <InfoTooltip text="Selecciona el tipo de usuario que desea crear para su sucursal." />
                    </label>

                    <select
                      name="rol_id"
                      value={form.rol_id}
                      onChange={handleChange}
                      required
                      disabled={loadingRoles || creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {loadingRoles ? 'Cargando roles...' : 'Seleccionar rol'}
                      </option>

                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>

                    {rolesError && (
                      <p className="mt-1 text-xs text-red-600">{rolesError}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-[#606266]">
                      Local / Sucursal
                    </label>

                    <select
                      name="sucursal_id"
                      value={form.sucursal_id}
                      onChange={handleChange}
                      required
                      disabled={isLoadingLocales || creatingUsuario}
                      className="h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="">{isLoadingLocales ? 'Cargando sucursales...' : 'Seleccionar sucursal'}</option>

                      {sucursales.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre} - {sucursal.codigo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permisos' && (
              <div>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">
                      Permisos del usuario
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Estos permisos se asignan automáticamente según el rol
                      seleccionado.
                    </p>
                  </div>

                  <span className="rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {selectedRol?.nombre || 'Sin rol'}
                  </span>
                </div>

                {!selectedRol ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    <p className="text-sm text-slate-500">
                      Primero selecciona un rol en la sección Asignación.
                    </p>
                  </div>
                ) : loadingPermisos ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    <p className="text-sm text-slate-500">
                      Cargando permisos...
                    </p>
                  </div>
                ) : permisosError ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded border border-red-200 bg-red-50">
                    <p className="text-sm text-red-600">{permisosError}</p>
                  </div>
                ) : permisos.length === 0 ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    <p className="text-sm text-slate-500">
                      Este rol no tiene permisos asignados.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {permisos.map((permiso) => (
                      <label
                        key={permiso.id}
                        className="flex items-start gap-3 rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="mt-0.5 h-4 w-4 rounded border-slate-300"
                        />

                        <span>
                          <span className="block font-medium text-slate-700">
                            {permiso.nombre}
                          </span>

                          <span className="block text-xs text-slate-500">
                            {permiso.codigo}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {createError && (
            <p className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">
                {createError}
            </p>
            )}

          <div className="flex justify-end gap-3 border-slate-200 pt-5">
                <button
                type="button"
                onClick={handleClose}
                disabled={creatingUsuario}
                className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                Cancelar
                </button>

                <button
                type="submit"
                disabled={loadingRoles || isLoadingLocales || creatingUsuario}
                className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {creatingUsuario ? 'Guardando...' : 'Guardar'}
                </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUsuarioModal