import { useState } from 'react'
import { compraService } from '../api/compraService'
import type { Compra, CreateCompraDto } from '../types/compra.types'

export function useCreateCompra() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function crearCompra(payload: CreateCompraDto): Promise<Compra | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await compraService.create(payload)

      return response.data.compra
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudo registrar la compra'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    crearCompra,
    isLoading,
    error,
    setError,
  }
}