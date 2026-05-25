import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { useCreateProveedor } from '../hooks/useCreateProveedor'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type ActiveSection = 'general' | 'ubicacion' | 'contacto' | 'control'

type FormData = {
  tipo_documento: string
  numero_documento: string
  razon_social: string
  nombre_comercial: string

  direccion: string
  departamento: string
  provincia: string
  distrito: string

  telefono: string
  celular: string
  correo: string
  contacto_nombre: string
  contacto_telefono: string
  contacto_correo: string

  observacion: string
  estado: boolean
}

const initialForm: FormData = {
  tipo_documento: 'RUC',
  numero_documento: '',
  razon_social: '',
  nombre_comercial: '',

  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',

  telefono: '',
  celular: '',
  correo: '',
  contacto_nombre: '',
  contacto_telefono: '',
  contacto_correo: '',

  observacion: '',
  estado: true,
}

export default function CreateProveedorModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<FormData>(initialForm)
  const [activeSection, setActiveSection] = useState<ActiveSection>('general')
  const [error, setError] = useState<string | null>(null)

  const user = useStoredUser()

  const {
    crearProveedor,
    isLoading: isCreatingProveedor,
    error: createError,
    setError: setCreateError,
  } = useCreateProveedor()

  if (!isOpen) return null

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target

    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (error) setError(null)
    if (createError) setCreateError(null)
  }

  function handleSectionChange(section: ActiveSection) {
    setError(null)
    setActiveSection(section)
  }

  function validateForm(): {
    section: ActiveSection
    message: string
  } | null {
    if (!user?.empresa_id) {
      return {
        section: 'general',
        message: 'No se encontró la empresa del usuario autenticado.',
      }
    }

    if (!form.tipo_documento.trim()) {
      return {
        section: 'general',
        message: 'Selecciona el tipo de documento.',
      }
    }

    if (!form.numero_documento.trim()) {
      return {
        section: 'general',
        message: 'Completa el campo: Número de documento.',
      }
    }

    if (form.tipo_documento === 'RUC' && !/^\d{11}$/.test(form.numero_documento.trim())) {
      return {
        section: 'general',
        message: 'El RUC debe contener 11 dígitos.',
      }
    }

    if (form.tipo_documento === 'DNI' && !/^\d{8}$/.test(form.numero_documento.trim())) {
      return {
        section: 'general',
        message: 'El DNI debe contener 8 dígitos.',
      }
    }

    if (!form.razon_social.trim()) {
      return {
        section: 'general',
        message: 'Completa el campo: Razón social.',
      }
    }

    if (form.correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      return {
        section: 'contacto',
        message: 'El correo del proveedor no tiene un formato válido.',
      }
    }

    if (
      form.contacto_correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto_correo.trim())
    ) {
      return {
        section: 'contacto',
        message: 'El correo del contacto no tiene un formato válido.',
      }
    }

    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setActiveSection(validationError.section)
      setError(validationError.message)
      return
    }

    const payload = {
    empresa_id: Number(user?.empresa_id),
    tipo_documento: form.tipo_documento,
    numero_documento: form.numero_documento.trim(),
    razon_social: form.razon_social.trim(),
    nombre_comercial: form.nombre_comercial.trim(),

    direccion: form.direccion.trim(),
    departamento: form.departamento.trim(),
    provincia: form.provincia.trim(),
    distrito: form.distrito.trim(),

    telefono: form.telefono.trim(),
    celular: form.celular.trim(),
    correo: form.correo.trim(),

    contacto_nombre: form.contacto_nombre.trim(),
    contacto_telefono: form.contacto_telefono.trim(),
    contacto_correo: form.contacto_correo.trim(),

    observacion: form.observacion.trim(),
    estado: form.estado,
    }

    const proveedor = await crearProveedor(payload)

    if (!proveedor) return

    setForm(initialForm)
    setActiveSection('general')
    onClose()
    onSuccess?.()
  }

  function handleClose() {
    setForm(initialForm)
    setActiveSection('general')
    setError(null)
    setCreateError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-3xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Crear proveedor
          </h3>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6 overflow-x-auto">
              <TabButton
                label="Datos generales"
                active={activeSection === 'general'}
                onClick={() => handleSectionChange('general')}
              />

              <TabButton
                label="Ubicación"
                active={activeSection === 'ubicacion'}
                onClick={() => handleSectionChange('ubicacion')}
              />

              <TabButton
                label="Contacto"
                active={activeSection === 'contacto'}
                onClick={() => handleSectionChange('contacto')}
              />

              <TabButton
                label="Control"
                active={activeSection === 'control'}
                onClick={() => handleSectionChange('control')}
              />
            </div>
          </div>

          {activeSection === 'general' && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tipo de documento"
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                options={[
                  ['RUC', 'RUC'],
                  ['DNI', 'DNI'],
                  ['CE', 'Carnet de extranjería'],
                  ['PASAPORTE', 'Pasaporte'],
                  ['OTRO', 'Otro'],
                ]}
              />

              <Input
                label="Número de documento"
                name="numero_documento"
                value={form.numero_documento}
                onChange={handleChange}
                required
                info="Para proveedores empresa normalmente se usa RUC de 11 dígitos."
              />

              <div className="col-span-2">
                <Input
                  label="Razón social"
                  name="razon_social"
                  value={form.razon_social}
                  onChange={handleChange}
                  required
                  info="Nombre legal del proveedor registrado en SUNAT o documento equivalente."
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Nombre comercial"
                  name="nombre_comercial"
                  value={form.nombre_comercial}
                  onChange={handleChange}
                  info="Nombre con el que normalmente se identifica al proveedor. Puede ser igual a la razón social."
                />
              </div>
            </div>
          )}

          {activeSection === 'ubicacion' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  info="Dirección fiscal o comercial del proveedor."
                />
              </div>

              <Input
                label="Departamento"
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
              />

              <Input
                label="Provincia"
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
              />

              <Input
                label="Distrito"
                name="distrito"
                value={form.distrito}
                onChange={handleChange}
              />
            </div>
          )}

          {activeSection === 'contacto' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />

              <Input
                label="Celular"
                name="celular"
                value={form.celular}
                onChange={handleChange}
              />

              <div className="col-span-2">
                <Input
                  label="Correo del proveedor"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  info="Correo general del proveedor para comprobantes, pedidos o coordinación."
                />
              </div>

              <Input
                label="Nombre de contacto"
                name="contacto_nombre"
                value={form.contacto_nombre}
                onChange={handleChange}
                info="Persona encargada de ventas, distribución o atención."
              />

              <Input
                label="Teléfono de contacto"
                name="contacto_telefono"
                value={form.contacto_telefono}
                onChange={handleChange}
              />

              <div className="col-span-2">
                <Input
                  label="Correo de contacto"
                  name="contacto_correo"
                  value={form.contacto_correo}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {activeSection === 'control' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">
                  Observación
                </label>

                <textarea
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  rows={4}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <Checkbox
                label="Proveedor activo"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
            </div>
          )}

          {(error || createError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error || createError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreatingProveedor}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingProveedor ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-sky-600 text-sky-600'
          : 'text-slate-500'
      }`}
    >
      {label}
    </button>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  info,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  info?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
        <span>{label}</span>
        {info && <InfoTooltip text={info} />}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
  )
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: [string, string][]
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium text-[#606266]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
}: {
  label: string
  name: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-center gap-3 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
      />

      {label}
    </label>
  )
}