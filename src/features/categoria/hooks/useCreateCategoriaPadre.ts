import { useState } from 'react'
import { categoriaService } from '../api/categoriaService'

type CreateCategoriaPadrePayload = {
  nombre: string
  descripcion: string | null
}

export function useCreateCategoriaPadre() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createCategoriaPadre(payload: CreateCategoriaPadrePayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await categoriaService.createPadre(payload)

      return response
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'No se pudo crear la categoría padre'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCategoriaPadre,
    isLoading,
    error,
  }
}