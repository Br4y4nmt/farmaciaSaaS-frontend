import { useState } from 'react'
import { empresaService } from '../api/empresaService'
import type { CreateEmpresaDto } from '../types/empresa.types'

export function useUpdateCompany() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateCompany(id: number, data: Partial<CreateEmpresaDto>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await empresaService.update(id, data)
      return response
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al actualizar empresa'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { updateCompany, isLoading, error }
}
