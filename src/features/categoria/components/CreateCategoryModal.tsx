import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { showErrorToast, showSuccessToast } from '../../../components/ui/toast'
import { useCreateCategoria } from '../hooks/useCreateCategoria'
import { useCategoriasRaiz } from '../hooks/useCategoriasRaiz'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type FormData = {
  nombre: string
  categoriaPadre: string
  descripcion: string
}

const initialForm: FormData = {
  nombre: '',
  categoriaPadre: '',
  descripcion: '',
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const user = useStoredUser()
  const { createCategoria, isLoading, error } = useCreateCategoria()
  const {
    categorias,
    isLoading: isLoadingCategorias,
  } = useCategoriasRaiz(user?.empresa_id)
  const [form, setForm] = useState<FormData>(initialForm)

  if (!isOpen) return null

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        'No se pudo crear la categoria',
        'No se encontro la empresa del usuario'
      )
      return
    }

    const response = await createCategoria({
      empresa_id: user.empresa_id,
      parent_id: form.categoriaPadre
        ? Number(form.categoriaPadre)
        : null,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      orden: 0,
      estado: true,
    })

    if (!response) {
      showErrorToast(
        'No se pudo crear la categoria',
        error || 'Verifica los datos e intentarlo nuevamente'
      )
      return
    }

    showSuccessToast(
      'Categoria creada correctamente',
      'La categoria fue registrada con exito'
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
            Nueva Categoría
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
                Categoria padre
              </label>
              <select
                name="categoriaPadre"
                value={form.categoriaPadre}
                onChange={handleChange}
                disabled={isLoadingCategorias || !user?.empresa_id}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="" disabled>
                  {isLoadingCategorias
                    ? 'Cargando categorias...'
                    : 'Seleccionar categoria'}
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#606266]">
                Descripcion
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
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
