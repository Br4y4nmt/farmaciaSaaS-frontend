import { useState } from 'react'
import { empresaService } from '../api/empresaService'

type UpdateSubscriptionData = {
  empresa_id: number
  plan_id: number | null
  fecha_inicio: string
  fecha_vencimiento: string
}

export function useUpdateSubscription() {
  const [isLoading, setIsLoading] = useState(false)

  async function updateSubscription(
    data: UpdateSubscriptionData
  ) {
    try {
      setIsLoading(true)

      const response =
        await empresaService.updateSubscription(
          data.empresa_id,
          {
            plan_id: data.plan_id,
            fecha_inicio: data.fecha_inicio,
            fecha_vencimiento:
              data.fecha_vencimiento,
          }
        )

      return response
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateSubscription,
    isLoading,
  }
}