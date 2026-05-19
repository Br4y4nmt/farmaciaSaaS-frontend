import { useState } from 'react'
import { deleteLaboratorio } from '../api/laboratorioService'

export function useDeleteLaboratorio() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteLaboratorio(id: number) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await deleteLaboratorio(id)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al eliminar laboratorio'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteLaboratorio: handleDeleteLaboratorio,
    isLoading,
    error,
  }
}
