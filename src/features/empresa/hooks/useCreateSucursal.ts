import { useState } from 'react'
import { sucursalService } from '../api/sucursalService'
import type { CreateSucursalDto } from '../types/empresa.types'

export function useCreateSucursal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createSucursal(data: CreateSucursalDto) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sucursalService.create(data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al crear sucursal'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createSucursal,
    isLoading,
    error,
  }
}