import { useState } from 'react'
import { categoriaService } from '../api/categoriaService'
import type { UpdateCategoriaDto } from '../types/categoria.types'

export function useUpdateCategoria() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateCategoria(id: number, data: UpdateCategoriaDto) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await categoriaService.update(id, data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al actualizar categoria'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateCategoria,
    isLoading,
    error,
  }
}
