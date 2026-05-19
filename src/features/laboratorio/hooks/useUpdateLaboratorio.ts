import { useState } from 'react'
import { updateLaboratorio } from '../api/laboratorioService'
import type { UpdateLaboratorioDto } from '../types/laboratorio.types'

export function useUpdateLaboratorio() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpdateLaboratorio(
    id: number,
    data: UpdateLaboratorioDto
  ) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await updateLaboratorio(id, data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al actualizar laboratorio'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateLaboratorio: handleUpdateLaboratorio,
    isLoading,
    error,
  }
}
