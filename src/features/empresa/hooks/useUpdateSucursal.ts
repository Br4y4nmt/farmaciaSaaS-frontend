import { useState } from 'react'
import { sucursalService } from '../api/sucursalService'
import type { CreateSucursalDto } from '../types/empresa.types'

export function useUpdateSucursal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateSucursal(
    id: number,
    data: Partial<CreateSucursalDto>
  ) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sucursalService.update(id, data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al actualizar sucursal'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateSucursal,
    isLoading,
    error,
  }
}