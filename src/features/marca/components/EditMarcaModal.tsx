import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { showErrorToast, showSuccessToast } from '../../../components/ui/toast'
import { useUpdateMarca } from '../hooks/useUpdateMarca'
import type { Marca } from '../types/marca.types'

type Props = {
  isOpen: boolean
  marca: Marca | null
  onClose: () => void
  onSuccess?: () => void
}

type FormData = {
  nombre: string
  descripcion: string
  estado: boolean
}

const initialForm: FormData = {
  nombre: '',
  descripcion: '',
  estado: true,
}

export default function EditMarcaModal({
  isOpen,
  marca,
  onClose,
  onSuccess,
}: Props) {
  const { updateMarca, isLoading, error } = useUpdateMarca()
  const [form, setForm] = useState<FormData>(initialForm)

  useEffect(() => {
    if (marca) {
      setForm({
        nombre: marca.nombre || '',
        descripcion: marca.descripcion || '',
        estado: marca.estado ?? true,
      })
    }
  }, [marca])

  if (!isOpen || !marca) return null

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: name === 'estado' ? value === 'true' : value,
    }))
  }

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (!marca) return

  const response = await updateMarca(marca.id, {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim() || null,
    estado: form.estado,
  })

  if (!response) {
    showErrorToast(
      'No se pudo actualizar la marca',
      error || 'Verifica los datos e intenta nuevamente'
    )
    return
  }

  showSuccessToast(
    'Marca actualizada correctamente',
    'Los datos de la marca fueron actualizados'
  )

  onClose()
  onSuccess?.()
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Editar Marca
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#606266]">
                Código
              </label>
              <input
                value={marca.codigo || ''}
                disabled
                className="rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500 outline-none"
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#606266]">
                Estado
              </label>
              <select
                name="estado"
                value={String(form.estado)}
                onChange={handleChange}
                className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

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
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}