import { useCallback, useEffect, useState } from 'react'
import { getLaboratorios } from '../api/laboratorioService'
import type { Laboratorio } from '../types/laboratorio.types'

export function useLaboratorios() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLaboratorios = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getLaboratorios()

      setLaboratorios(
        response.laboratorios || []
      )
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener laboratorios'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

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