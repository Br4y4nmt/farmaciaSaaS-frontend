import { useState } from 'react'
import { localService } from '../api/localService'
import type { CreateLocalDto } from '../types/empresa.types'

export function useCreateLocal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createLocal(payload: CreateLocalDto) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await localService.create(payload)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al crear el local / sucursal'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createLocal,
    isLoading,
    error,
  }
}