import { useState } from 'react'
import { categoriaService } from '../api/categoriaService'

export function useDeleteCategoria() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function deleteCategoria(id: number) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await categoriaService.delete(id)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al eliminar categoria'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteCategoria,
    isLoading,
    error,
  }
}
