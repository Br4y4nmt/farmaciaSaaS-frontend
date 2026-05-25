import { useState } from 'react'
import { localService } from '../api/localService'
import type { CreateLocalDto } from '../types/empresa.types'

export function useUpdateLocal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateLocal(id: number, payload: Partial<CreateLocalDto>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await localService.update(id, payload)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al actualizar el local / sucursal'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateLocal,
    isLoading,
    error,
  }
}