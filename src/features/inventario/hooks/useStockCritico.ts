import { useCallback, useEffect, useState } from 'react'
import { stockCriticoService } from '../api/stockCriticoService'
import type {
  StockCritico,
  StockCriticoResumen,
} from '../types/stockCritico.types'

const initialResumen: StockCriticoResumen = {
  sin_stock: 0,
  critico: 0,
  bajo: 0,
  total: 0,
}

export function useStockCritico() {
  const [stockCritico, setStockCritico] = useState<StockCritico[]>([])
  const [resumen, setResumen] = useState<StockCriticoResumen>(initialResumen)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStockCritico = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await stockCriticoService.getAll()

      setStockCritico(response.stock_critico || [])
      setResumen(response.resumen || initialResumen)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudo cargar el stock crítico'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStockCritico()
  }, [fetchStockCritico])

  return {
    stockCritico,
    resumen,
    isLoading,
    error,
    refetch: fetchStockCritico,
  }
}