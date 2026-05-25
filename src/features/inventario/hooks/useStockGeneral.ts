import { useCallback, useEffect, useState } from 'react'
import { stockService } from '../api/stockService'
import type { StockGeneral } from '../types/inventario.types'

export function useStockGeneral() {
  const [stock, setStock] = useState<StockGeneral[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStockGeneral = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await stockService.getStockGeneral()
      setStock(response.stock || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Error al obtener el stock general'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStockGeneral()
  }, [fetchStockGeneral])

  return {
    stock,
    isLoading,
    error,
    refetch: fetchStockGeneral,
  }
}