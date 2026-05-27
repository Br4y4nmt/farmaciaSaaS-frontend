import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { CloseIcon } from '../../../components/icons'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import { showSuccessToast } from '../../../components/ui/toast'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { useUpdateProveedor } from '../hooks/useUpdateProveedor'
import type { Proveedor } from '../types/proveedor.types'
import {
  ubigeoService,
  type Departamento,
  type Provincia,
  type Distrito,
} from '../../empresa/api/ubigeoService'

type Props = {
  isOpen: boolean
  proveedor: Proveedor | null
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

function buildFormFromProveedor(proveedor: Proveedor): FormData {
  return {
    tipo_documento: proveedor.tipo_documento || 'RUC',
    numero_documento: proveedor.numero_documento || '',
    razon_social: proveedor.razon_social || '',
    nombre_comercial: proveedor.nombre_comercial || '',

    direccion: proveedor.direccion || '',
    departamento: proveedor.departamento || '',
    provincia: proveedor.provincia || '',
    distrito: proveedor.distrito || '',

    telefono: proveedor.telefono || '',
    celular: proveedor.celular || '',
    correo: proveedor.correo || '',
    contacto_nombre: proveedor.contacto_nombre || '',
    contacto_telefono: proveedor.contacto_telefono || '',
    contacto_correo: proveedor.contacto_correo || '',

    observacion: proveedor.observacion || '',
    estado: proveedor.estado,
  }
}

function normalizeForm(form: FormData): FormData {
  return {
    ...form,
    tipo_documento: form.tipo_documento.trim(),
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
  }
}

export default function EditProveedorModal({
  isOpen,
  proveedor,
  onClose,
  onSuccess,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const [form, setForm] = useState<FormData>(initialForm)
  const [originalForm, setOriginalForm] = useState<FormData>(initialForm)
  const [activeSection, setActiveSection] = useState<ActiveSection>('general')
  const [error, setError] = useState<string | null>(null)

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [distritos, setDistritos] = useState<Distrito[]>([])

  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false)
  const [loadingProvincias, setLoadingProvincias] = useState(false)
  const [loadingDistritos, setLoadingDistritos] = useState(false)

  const user = useStoredUser()

  const {
    actualizarProveedor,
    isLoading: isUpdatingProveedor,
    error: updateError,
    setError: setUpdateError,
  } = useUpdateProveedor()

  useEffect(() => {
    if (!isOpen || !proveedor) return

    const loadedForm = buildFormFromProveedor(proveedor)

    setForm(loadedForm)
    setOriginalForm(loadedForm)

    setActiveSection('general')
    setError(null)
    setUpdateError(null)

    async function loadUbigeoData() {
      try {
        setLoadingDepartamentos(true)

        const departamentosData = await ubigeoService.getDepartamentos()
        setDepartamentos(departamentosData)

        if (loadedForm.departamento) {
          setLoadingProvincias(true)

          const provinciasData = await ubigeoService.getProvincias(
            loadedForm.departamento,
          )

          setProvincias(provinciasData)

          if (loadedForm.provincia) {
            setLoadingDistritos(true)

            const distritosData = await ubigeoService.getDistritos(
              loadedForm.departamento,
              loadedForm.provincia,
            )

            setDistritos(distritosData)
          } else {
            setDistritos([])
          }
        } else {
          setProvincias([])
          setDistritos([])
        }
      } catch (error) {
        console.error(error)
        setError('No se pudieron cargar los datos de ubicación.')
      } finally {
        setLoadingDepartamentos(false)
        setLoadingProvincias(false)
        setLoadingDistritos(false)
      }
    }

    loadUbigeoData()
  }, [isOpen, proveedor, setUpdateError])

  if (!isOpen || !proveedor) return null

  const hasChanges =
    JSON.stringify(normalizeForm(form)) !== JSON.stringify(normalizeForm(originalForm))

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
    if (updateError) setUpdateError(null)
  }

  async function handleDepartamentoChange(e: ChangeEvent<HTMLSelectElement>) {
    const departamento = e.target.value

    setForm((prev) => ({
      ...prev,
      departamento,
      provincia: '',
      distrito: '',
    }))

    setProvincias([])
    setDistritos([])

    if (error) setError(null)
    if (updateError) setUpdateError(null)

    if (!departamento) return

    try {
      setLoadingProvincias(true)

      const data = await ubigeoService.getProvincias(departamento)
      setProvincias(data)
    } catch (error) {
      console.error(error)
      setError('No se pudieron cargar las provincias.')
    } finally {
      setLoadingProvincias(false)
    }
  }

  async function handleProvinciaChange(e: ChangeEvent<HTMLSelectElement>) {
    const provincia = e.target.value

    setForm((prev) => ({
      ...prev,
      provincia,
      distrito: '',
    }))

    setDistritos([])

    if (error) setError(null)
    if (updateError) setUpdateError(null)

    if (!form.departamento || !provincia) return

    try {
      setLoadingDistritos(true)

      const data = await ubigeoService.getDistritos(form.departamento, provincia)
      setDistritos(data)
    } catch (error) {
      console.error(error)
      setError('No se pudieron cargar los distritos.')
    } finally {
      setLoadingDistritos(false)
    }
  }

  function handleSectionChange(section: ActiveSection) {
    setError(null)
    setActiveSection(section)
  }

  function showHtml5ValidationInSection(section: ActiveSection) {
    setError(null)
    setUpdateError(null)
    setActiveSection(section)

    setTimeout(() => {
      formRef.current?.reportValidity()
    }, 0)
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

    if (
      form.tipo_documento === 'RUC' &&
      !/^\d{11}$/.test(form.numero_documento.trim())
    ) {
      return {
        section: 'general',
        message: 'El RUC debe contener 11 dígitos.',
      }
    }

    if (
      form.tipo_documento === 'DNI' &&
      !/^\d{8}$/.test(form.numero_documento.trim())
    ) {
      return {
        section: 'general',
        message: 'El DNI debe contener 8 dígitos.',
      }
    }

    if (
      form.correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())
    ) {
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

    if (!hasChanges) {
      return
    }

    if (!form.numero_documento.trim()) {
      showHtml5ValidationInSection('general')
      return
    }

    if (
      !form.direccion.trim() ||
      !form.departamento.trim() ||
      !form.provincia.trim() ||
      !form.distrito.trim()
    ) {
      showHtml5ValidationInSection('ubicacion')
      return
    }

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

    if (!proveedor) return

    const proveedorActualizado = await actualizarProveedor(proveedor.id, payload)

    if (!proveedorActualizado) return

    showSuccessToast(
      'Proveedor actualizado',
      'Los cambios se guardaron correctamente.',
    )

    setForm(initialForm)
    setOriginalForm(initialForm)
    setActiveSection('general')
    setProvincias([])
    setDistritos([])
    onClose()
    onSuccess?.()
  }

  function handleClose() {
    setForm(initialForm)
    setOriginalForm(initialForm)
    setActiveSection('general')
    setError(null)
    setUpdateError(null)
    setProvincias([])
    setDistritos([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-3xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Editar proveedor
          </h3>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-5"
        >
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
                required
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
                  info="Opcional. Nombre legal del proveedor registrado en SUNAT o documento equivalente."
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Nombre comercial"
                  name="nombre_comercial"
                  value={form.nombre_comercial}
                  onChange={handleChange}
                  info="Opcional. Nombre con el que normalmente se identifica al proveedor."
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
                  required
                  info="Dirección fiscal o comercial del proveedor."
                />
              </div>

              <Select
                label="Departamento"
                name="departamento"
                value={form.departamento}
                onChange={handleDepartamentoChange}
                disabled={loadingDepartamentos}
                required
                options={[
                  [
                    '',
                    loadingDepartamentos
                      ? 'Cargando departamentos...'
                      : 'Seleccione departamento',
                  ],
                  ...departamentos.map((departamento) => [
                    departamento.nombre,
                    departamento.nombre,
                  ] as [string, string]),
                ]}
              />

              <Select
                label="Provincia"
                name="provincia"
                value={form.provincia}
                onChange={handleProvinciaChange}
                disabled={!form.departamento || loadingProvincias}
                required
                options={[
                  [
                    '',
                    loadingProvincias
                      ? 'Cargando provincias...'
                      : 'Seleccione provincia',
                  ],
                  ...provincias.map((provincia) => [
                    provincia.nombre,
                    provincia.nombre,
                  ] as [string, string]),
                ]}
              />

              <Select
                label="Distrito"
                name="distrito"
                value={form.distrito}
                onChange={handleChange}
                disabled={!form.provincia || loadingDistritos}
                required
                options={[
                  [
                    '',
                    loadingDistritos
                      ? 'Cargando distritos...'
                      : 'Seleccione distrito',
                  ],
                  ...distritos.map((distrito) => [
                    distrito.nombre,
                    distrito.nombre,
                  ] as [string, string]),
                ]}
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
                  info="Opcional. Correo general del proveedor para comprobantes, pedidos o coordinación."
                />
              </div>

              <Input
                label="Nombre de contacto"
                name="contacto_nombre"
                value={form.contacto_nombre}
                onChange={handleChange}
                info="Opcional. Persona encargada de ventas, distribución o atención."
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

          {(error || updateError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error || updateError}
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
              disabled={isUpdatingProveedor || !hasChanges}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingProveedor ? 'Guardando...' : 'Guardar'}
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
  required = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: [string, string][]
  disabled?: boolean
  required?: boolean
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
        required={required}
        className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map(([value, label]) => (
          <option key={`${name}-${value}`} value={value}>
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