import { useEffect, useState } from 'react'
import { metodoPagoService } from '../api/metodoPagoService'
import type { MetodoPago } from '../types/metodoPago.types'

export function useMetodosPago() {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchMetodosPago() {
    try {
      setIsLoading(true)
      setError(null)

      const data = await metodoPagoService.getAll()

      setMetodosPago(data)
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los métodos de pago'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetodosPago()
  }, [])

  return {
    metodosPago,
    isLoading,
    error,
    refetch: fetchMetodosPago,
  }
}