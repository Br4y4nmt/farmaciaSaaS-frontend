import { useState } from 'react'
import { updateMarca as updateMarcaApi } from '../api/marcaService'
import type { Marca, UpdateMarcaDto } from '../types/marca.types'

export function useUpdateMarca() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateMarca(
    id: number,
    payload: UpdateMarcaDto
  ): Promise<Marca | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await updateMarcaApi(id, payload)

      return response
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo actualizar la marca'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateMarca,
    isLoading,
    error,
  }
}