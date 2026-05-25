import { useRef, useState, type FormEvent, type ChangeEvent } from 'react'
import {
  showSuccessToast,
  showErrorToast,
} from '../../../components/ui/toast'
import { useCreateCompany } from '../hooks/useCreateCompany'
import { CloseIcon } from '../../../components/icons'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type FormData = {
  nombre: string
  ruc: string
  direccion: string
  telefono: string
  correo: string
  admin_nombres: string
  admin_apellidos: string
  admin_correo: string
  admin_password: string
  admin_telefono: string
}

const initialForm: FormData = {
  nombre: '',
  ruc: '',
  direccion: '',
  telefono: '',
  correo: '',
  admin_nombres: '',
  admin_apellidos: '',
  admin_correo: '',
  admin_password: '',
  admin_telefono: '',
}

export default function CreateCompanyModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { createCompany, isLoading } = useCreateCompany()

  const [form, setForm] = useState<FormData>(initialForm)

  const [activeSection, setActiveSection] = useState<'empresa' | 'admin'>(
    'empresa',
  )

  const nombreEmpresaRef = useRef<HTMLInputElement | null>(null)
  const rucRef = useRef<HTMLInputElement | null>(null)
  const telefonoRef = useRef<HTMLInputElement | null>(null)
  const direccionRef = useRef<HTMLInputElement | null>(null)
  const correoRef = useRef<HTMLInputElement | null>(null)

  const adminNombresRef = useRef<HTMLInputElement | null>(null)
  const adminApellidosRef = useRef<HTMLInputElement | null>(null)
  const adminCorreoRef = useRef<HTMLInputElement | null>(null)
  const adminPasswordRef = useRef<HTMLInputElement | null>(null)

  if (!isOpen) return null

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function validateFields(fields: Array<HTMLInputElement | null>) {
    const invalidField = fields.find((field) => field && !field.checkValidity())

    if (invalidField) {
      invalidField.focus()
      invalidField.reportValidity()
      return false
    }

    return true
  }

  function validateEmpresaSection() {
    return validateFields([
      nombreEmpresaRef.current,
      rucRef.current,
      telefonoRef.current,
      direccionRef.current,
      correoRef.current,
    ])
  }

  function validateAdminSection() {
    return validateFields([
      adminNombresRef.current,
      adminApellidosRef.current,
      adminCorreoRef.current,
      adminPasswordRef.current,
    ])
  }

  function goToAdminAndValidate() {
    setActiveSection('admin')

    setTimeout(() => {
      validateAdminSection()
    }, 0)
  }

  function handleSectionChange(section: 'empresa' | 'admin') {
    if (section === 'admin') {
      const empresaIsValid = validateEmpresaSection()

      if (!empresaIsValid) return

      goToAdminAndValidate()
      return
    }

    setActiveSection('empresa')
  }

  function handleClose() {
    setForm(initialForm)
    setActiveSection('empresa')
    onClose()
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (activeSection === 'empresa') {
      const empresaIsValid = validateEmpresaSection()

      if (!empresaIsValid) return

      goToAdminAndValidate()
      return
    }

    const adminIsValid = validateAdminSection()

    if (!adminIsValid) return

    const response = await createCompany(form)

    if (response) {
      showSuccessToast(
        'Empresa creada correctamente',
        'La empresa fue registrada con éxito',
      )

      setForm(initialForm)
      setActiveSection('empresa')

      onClose()
      onSuccess?.()

      return
    }

    showErrorToast(
      'No se pudo crear la empresa',
      'Verifica los datos e inténtalo nuevamente',
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Crear empresa
          </h3>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => handleSectionChange('empresa')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'empresa'
                    ? 'border-b-2 border-sky-600 text-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Datos de la empresa
              </button>

              <button
                type="button"
                onClick={() => handleSectionChange('admin')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'admin'
                    ? 'border-b-2 border-sky-600 text-sky-600'
                    : 'text-slate-500'
                }`}
              >
                Administrador
              </button>
            </div>
          </div>

          {activeSection === 'empresa' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Nombre empresa
                  </label>

                  <input
                    ref={nombreEmpresaRef}
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    RUC
                  </label>

                  <input
                    ref={rucRef}
                    name="ruc"
                    value={form.ruc}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Teléfono empresa
                  </label>

                  <input
                    ref={telefonoRef}
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Dirección
                  </label>

                  <input
                    ref={direccionRef}
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Correo empresa
                  </label>

                  <input
                    ref={correoRef}
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'admin' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Nombres
                  </label>

                  <input
                    ref={adminNombresRef}
                    name="admin_nombres"
                    value={form.admin_nombres}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Apellidos
                  </label>

                  <input
                    ref={adminApellidosRef}
                    name="admin_apellidos"
                    value={form.admin_apellidos}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Correo administrador
                  </label>

                  <input
                    ref={adminCorreoRef}
                    type="email"
                    name="admin_correo"
                    value={form.admin_correo}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Contraseña
                  </label>

                  <input
                    ref={adminPasswordRef}
                    type="password"
                    name="admin_password"
                    value={form.admin_password}
                    onChange={handleChange}
                    required
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Teléfono administrador
                  </label>

                  <input
                    name="admin_telefono"
                    value={form.admin_telefono}
                    onChange={handleChange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}