import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useCreateCompany } from '../hooks/useCreateCompany'

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

  if (!isOpen) return null

  function handleChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const response = await createCompany(form)

    if (response) {
      setForm(initialForm)
      onClose()
      onSuccess?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800">
            Crear empresa
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Cerrar
          </button>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* Empresa */}
          <div className="md:col-span-2">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">
              Datos de la empresa
            </h4>
          </div>

          <input
            name="nombre"
            placeholder="Nombre empresa"
            value={form.nombre}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            name="ruc"
            placeholder="RUC"
            value={form.ruc}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            name="telefono"
            placeholder="Teléfono empresa"
            value={form.telefono}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo empresa"
            value={form.correo}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 md:col-span-2"
          />

          {/* Admin */}
          <div className="mt-4 md:col-span-2">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">
              Administrador
            </h4>
          </div>

          <input
            name="admin_nombres"
            placeholder="Nombres"
            value={form.admin_nombres}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            name="admin_apellidos"
            placeholder="Apellidos"
            value={form.admin_apellidos}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            type="email"
            name="admin_correo"
            placeholder="Correo administrador"
            value={form.admin_correo}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            type="password"
            name="admin_password"
            placeholder="Contraseña"
            value={form.admin_password}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />

          <input
            name="admin_telefono"
            placeholder="Teléfono administrador"
            value={form.admin_telefono}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 md:col-span-2"
          />

          {/* Error */}
          {error && (
            <div className="md:col-span-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}