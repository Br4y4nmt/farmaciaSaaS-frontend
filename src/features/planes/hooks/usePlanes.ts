import { useCallback, useEffect, useState } from 'react'
import { planService } from '../api/planService'
import type { Plan } from '../types/plan.types'

export function usePlanes() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlanes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await planService.getAll()

      setPlanes(response.planes ?? [])
    } catch (error) {
      console.error('Error cargando planes:', error)

      setError('No se pudieron cargar los planes')
      setPlanes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlanes()
  }, [fetchPlanes])

  return {
    planes,
    isLoading,
    error,
    refetch: fetchPlanes,
  }
}