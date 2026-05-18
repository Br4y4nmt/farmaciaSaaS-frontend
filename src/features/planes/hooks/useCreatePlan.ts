import { useState } from 'react'
import { planService } from '../api/planService'
import type { CreatePlanDto } from '../types/plan.types'

export function useCreatePlan() {
  const [isLoading, setIsLoading] = useState(false)

  async function createPlan(
    data: CreatePlanDto
  ) {
    try {
      setIsLoading(true)

      return await planService.create(data)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createPlan,
    isLoading,
  }
}