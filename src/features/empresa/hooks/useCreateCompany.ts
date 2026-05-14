import { useState } from 'react'
import { empresaService } from '../api/empresaService'
import type { CreateEmpresaDto } from '../types/empresa.types'

export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createCompany(data: CreateEmpresaDto) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await empresaService.create(data)
      return response
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al crear empresa'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCompany,
    isLoading,
    error,
  }
}