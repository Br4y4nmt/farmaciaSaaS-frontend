import { useState } from 'react'
import { createLaboratorio } from '../api/laboratorioService'
import type { CreateLaboratorioDto } from '../types/laboratorio.types'

export function useCreateLaboratorio() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreateLaboratorio(data: CreateLaboratorioDto) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await createLaboratorio(data)
      setIsLoading(false)
      return response
    } catch (err: any) {
      setIsLoading(false)
      setError(err?.response?.data?.message || 'Error al crear laboratorio')
      return null
    }
  }

  return {
    createLaboratorio: handleCreateLaboratorio,
    isLoading,
    error,
  }
}
