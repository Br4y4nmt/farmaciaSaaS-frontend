import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { showErrorToast, showSuccessToast } from '../../../components/ui/toast'
import { useCreateCategoria } from '../hooks/useCreateCategoria'
import CreateParentCategoryModal from './CreateParentCategoryModal'
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
    refetch: refetchCategoriasRaiz,
  } = useCategoriasRaiz(user?.empresa_id)

  const [form, setForm] = useState<FormData>(initialForm)
  const [openParentModal, setOpenParentModal] = useState(false)

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

    function handleNewParentCategory() {
      setOpenParentModal(true)
    }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user?.empresa_id) {
      showErrorToast(
        'No se pudo crear la categoría',
        'No se encontró la empresa del usuario'
      )
      return
    }

    if (!form.categoriaPadre) {
      showErrorToast(
        'Categoría padre requerida',
        'Debes seleccionar una categoría padre'
      )
      return
    }

    const response = await createCategoria({
      empresa_id: user.empresa_id,
      parent_id: Number(form.categoriaPadre),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      orden: 0,
      estado: true,
    })

    if (!response) {
      showErrorToast(
        'No se pudo crear la categoría',
        error || 'Verifica los datos e inténtalo nuevamente'
      )
      return
    }

    showSuccessToast(
      'Categoría creada correctamente',
      'La categoría fue registrada con éxito'
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
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
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
              <div className="flex items-center gap-2">
                <label className="text-[13px] font-medium text-[#606266]">
                  Categoría padre *
                </label>

              <button
              type="button"
              onClick={handleNewParentCategory}
              className="cursor-pointer text-[13px] font-semibold text-sky-600 transition hover:text-sky-700"
            >
              [+ Nuevo]
            </button>
              </div>

              <select
                name="categoriaPadre"
                value={form.categoriaPadre}
                onChange={handleChange}
                required
                disabled={isLoadingCategorias || !user?.empresa_id}
                className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="" disabled>
                  {isLoadingCategorias
                    ? 'Cargando categorías...'
                    : 'Seleccionar categoría'}
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
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>


        <CreateParentCategoryModal
          isOpen={openParentModal}
          onClose={() => setOpenParentModal(false)}
          onSuccess={async () => {
            setOpenParentModal(false)

            await refetchCategoriasRaiz()
          }}
        />

        
      </div>
    </div>
  )
}