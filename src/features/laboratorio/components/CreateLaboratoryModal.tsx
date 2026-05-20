import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { showErrorToast, showSuccessToast } from '../../../components/ui/toast'
import { useCreateLaboratorio } from '../hooks/useCreateLaboratorio'


type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type FormData = {
  nombre: string
  descripcion: string
}

const initialForm: FormData = {
  nombre: '',
  descripcion: '',
}

export default function CreateLaboratoryModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const user = useStoredUser()
  const { createLaboratorio, isLoading, error } = useCreateLaboratorio()
  const [form, setForm] = useState<FormData>(initialForm)

  if (!isOpen) return null

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.empresa_id) {
      showErrorToast(
        'No se pudo crear el laboratorio',
        'No se encontró la empresa del usuario'
      )
      return
    }

    console.debug('CreateLaboratoryModal: submitting', { empresa_id: user.empresa_id, form })

    const response = await createLaboratorio({
      empresa_id: user.empresa_id,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
    })

    console.debug('CreateLaboratoryModal: response', response)

    if (!response) {
      showErrorToast(
        'No se pudo crear el laboratorio',
        error || 'Verifica los datos e intenta nuevamente'
      )
      return
    }

    showSuccessToast(
      'Laboratorio creado correctamente',
      'El laboratorio fue registrado con éxito'
    )

    setForm(initialForm)
    onClose()
    onSuccess?.()
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
            Nuevo Laboratorio
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#606266]">
                Nombre *
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#606266]">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
                className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
