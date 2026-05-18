import { useState } from 'react'
import { planService } from '../api/planService'
import type { UpdatePlanDto } from '../types/plan.types'

export function useUpdatePlan() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updatePlan(id: number, data: UpdatePlanDto) {
    setIsLoading(true)
    setError(null)

    try {
      return await planService.update(id, data)
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Error al actualizar el plan'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updatePlan,
    isLoading,
    error,
  }
}
