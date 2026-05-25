import { useCallback, useEffect, useState } from 'react'
import { movimientoStockService } from '../api/movimientoStockService'
import type { MovimientoStock } from '../types/movimientoStock.types'

export function useMovimientosStock() {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMovimientos = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await movimientoStockService.getAll()

      setMovimientos(response.movimientos || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudieron cargar los movimientos de stock'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMovimientos()
  }, [fetchMovimientos])

  return {
    movimientos,
    isLoading,
    error,
    refetch: fetchMovimientos,
  }
}