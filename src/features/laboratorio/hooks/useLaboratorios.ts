import { useCallback, useEffect, useState } from 'react'
import { getLaboratorios } from '../api/laboratorioService'
import type { Laboratorio } from '../types/laboratorio.types'

type UseLaboratoriosParams = {
  page?: number
  limit?: number
  estado?: boolean
  nombre?: string
}

export function useLaboratorios(params?: UseLaboratoriosParams) {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLaboratorios = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getLaboratorios(params)

      setLaboratorios(response.laboratorios || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener laboratorios'

      setError(message)
      setLaboratorios([])
    } finally {
      setIsLoading(false)
    }
  }, [params?.page, params?.limit, params?.estado, params?.nombre])

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