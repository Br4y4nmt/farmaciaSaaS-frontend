import { useState } from 'react'
import { ventaService } from '../api/ventaService'
import type { CreateVentaRapidaPayload } from '../types/venta.types'

export function useCreateVentaRapida() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createVentaRapida(payload: CreateVentaRapidaPayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await ventaService.createVentaRapida(payload)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo registrar la venta'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createVentaRapida,
    isLoading,
    error,
  }
}