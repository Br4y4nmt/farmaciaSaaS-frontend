import { useCallback, useEffect, useState } from 'react'
import { getLaboratorios } from '../api/laboratorioService'
import type { Laboratorio } from '../types/laboratorio.types'

export function useLaboratorios(empresaId?: number) {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLaboratorios = useCallback(async () => {
    if (!empresaId) {
      setLaboratorios([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getLaboratorios(empresaId)
      setLaboratorios(response.laboratorios || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener laboratorios'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    fetchLaboratorios()
  }, [fetchLaboratorios])

  return {
    laboratorios,
    isLoading,
    error,
    refetch: fetchLaboratorios,
  }
}
