import { useState } from 'react'
import { deleteMarca as deleteMarcaApi } from '../api/marcaService'

export function useDeleteMarca() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function deleteMarca(id: number): Promise<boolean> {
    try {
      setIsDeleting(true)
      setDeleteError(null)

      await deleteMarcaApi(id)

      return true
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo eliminar la marca'

      setDeleteError(message)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteMarca,
    isDeleting,
    deleteError,
  }
}