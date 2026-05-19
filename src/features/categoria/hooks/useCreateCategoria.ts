import { useState } from 'react'
import { categoriaService } from '../api/categoriaService'
import type { CreateCategoriaDto } from '../types/categoria.types'

export function useCreateCategoria() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createCategoria(data: CreateCategoriaDto) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await categoriaService.create(data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al crear categoria'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCategoria,
    isLoading,
    error,
  }
}
