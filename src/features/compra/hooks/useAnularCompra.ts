import { useState } from 'react'
import { compraService } from '../api/compraService'
import type { Compra } from '../types/compra.types'

export function useAnularCompra() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function anularCompra(
    id: number,
    motivo?: string,
  ): Promise<Compra | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await compraService.anular(id, motivo)

      return response.data?.compra || null
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudo anular la compra'

      setError(message)

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    anularCompra,
    isLoading,
    error,
    setError,
  }
}