import { useState } from 'react'
import { sucursalService } from '../api/sucursalService'

export function useDeleteSucursal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function deleteSucursal(id: number) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sucursalService.delete(id)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al eliminar sucursal'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteSucursal,
    isLoading,
    error,
  }
}