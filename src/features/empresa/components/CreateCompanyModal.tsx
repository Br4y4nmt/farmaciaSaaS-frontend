import { useState, type FormEvent, type ChangeEvent } from 'react'
import {
  showSuccessToast,
  showErrorToast
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
  const { createCompany, isLoading, error } = useCreateCompany()

  const [form, setForm] = useState<FormData>(initialForm)
  const [activeSection, setActiveSection] = useState<'empresa' | 'admin'>(
    'empresa',
  )
  const [sectionError, setSectionError] = useState<string | null>(null)

  if (!isOpen) return null

  function handleChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (sectionError) {
      setSectionError(null)
    }
  }

  function handleSectionChange(section: 'empresa' | 'admin') {
    if (section === 'admin' && !form.nombre.trim()) {
      setSectionError('Completa el campo: Nombre empresa.')
      setActiveSection('empresa')
      return
    }

    setSectionError(null)
    setActiveSection(section)
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    const response =
      await createCompany(form)

    if (response) {
      showSuccessToast(
        'Empresa creada correctamente',
        'La empresa fue registrada con éxito'
      )

      setForm(initialForm)

      onClose()

      onSuccess?.()

      return
    }

    showErrorToast(
      'No se pudo crear la empresa',
      'Verifica los datos e inténtalo nuevamente'
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Crear empresa
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => handleSectionChange('empresa')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeSection === 'empresa'
                    ? 'text-sky-600 border-b-2 border-sky-600'
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
                    ? 'text-sky-600 border-b-2 border-sky-600'
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
                    name="ruc"
                    value={form.ruc}
                    onChange={handleChange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Teléfono empresa
                  </label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[13px] font-medium text-[#606266]">
                    Correo empresa
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
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

          {(error || sectionError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {sectionError || error}
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
              {isLoading ? 'Creando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}