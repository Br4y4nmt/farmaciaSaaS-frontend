import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { showErrorToast, showSuccessToast } from '../../../components/ui/toast'
import { useUpdateCategoria } from '../hooks/useUpdateCategoria'
import { useCategoriasRaiz } from '../hooks/useCategoriasRaiz'
import type { Categoria } from '../types/categoria.types'

type Props = {
  isOpen: boolean
  category: Categoria | null
  onClose: () => void
  onUpdated?: () => void
}

type FormData = {
  nombre: string
  categoriaPadre: string
  descripcion: string
  estado: boolean
}

const initialForm: FormData = {
  nombre: '',
  categoriaPadre: '',
  descripcion: '',
  estado: true,
}

export default function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onUpdated,
}: Props) {
  const { updateCategoria, isLoading, error } = useUpdateCategoria()
  const { categorias, isLoading: isLoadingCategorias } = useCategoriasRaiz(
    category?.empresa_id
  )
  const [form, setForm] = useState<FormData>(initialForm)

  useEffect(() => {
    if (!category) return

    setForm({
      nombre: category.nombre ?? '',
      categoriaPadre: category.parent_id ? String(category.parent_id) : '',
      descripcion: category.descripcion ?? '',
      estado: category.estado ?? true,
    })
  }, [category])

  if (!isOpen || !category) return null

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    const isCheckbox =
      event.target instanceof HTMLInputElement &&
      event.target.type === 'checkbox'

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (event.target as HTMLInputElement).checked
        : value,
    }))
  }

  function handleClose() {
    setForm(initialForm)
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const response = await updateCategoria(category.id, {
      parent_id: form.categoriaPadre
        ? Number(form.categoriaPadre)
        : null,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      estado: form.estado,
    })

    if (!response) {
      showErrorToast(
        'No se pudo actualizar la categoria',
        error || 'Verifica los datos e intentarlo nuevamente'
      )
      return
    }

    showSuccessToast(
      'Categoria actualizada correctamente',
      'La categoria fue actualizada con exito'
    )

    handleClose()
    onUpdated?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative w-full max-w-2xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Editar Categoria
          </h3>

          <button
            type="button"
            onClick={handleClose}
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
                disabled={isLoadingCategorias}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {isLoadingCategorias
                    ? 'Cargando categorias...'
                    : 'Sin categoria'}
                </option>
                {categorias
                  .filter((item) => item.id !== category.id)
                  .map((categoria) => (
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

            <div className="col-span-2 flex items-center justify-between gap-4 rounded border border-slate-200 px-3 py-2">
              <div>
                <p className="text-[13px] font-medium text-[#606266]">Estado</p>
                <p className="text-xs text-slate-500">
                  {form.estado ? 'Activo' : 'Inactivo'}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="estado"
                  checked={form.estado}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-slate-900" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>
          </div>

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
