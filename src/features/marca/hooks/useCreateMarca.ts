import { useState } from 'react'
import { createMarca as createMarcaApi } from '../api/marcaService'
import type { CreateMarcaDto, Marca } from '../types/marca.types'

export function useCreateMarca() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createMarca(payload: CreateMarcaDto): Promise<Marca | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await createMarcaApi(payload)

      return response
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo crear la marca'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createMarca,
    isLoading,
    error,
  }
}