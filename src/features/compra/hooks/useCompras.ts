import { useCallback, useEffect, useState } from 'react'
import { compraService } from '../api/compraService'
import type { Compra } from '../types/compra.types'

export function useCompras() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompras = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await compraService.getAll()
      setCompras(response.compras || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudieron cargar las compras'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCompras()
  }, [fetchCompras])

  return {
    compras,
    isLoading,
    error,
    refetch: fetchCompras,
  }
}