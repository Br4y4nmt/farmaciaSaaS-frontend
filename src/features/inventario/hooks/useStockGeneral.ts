import { useCallback, useEffect, useState } from 'react'
import { stockService } from '../api/stockService'
import type {
  GetStockGeneralResponse,
  StockGeneral,
  StockGeneralResumen,
} from '../types/inventario.types'

type UseStockGeneralParams = {
  page?: number
  limit?: number
  search?: string
  sucursal_id?: number | string
}

const initialResumen: StockGeneralResumen = {
  total_productos: 0,
  agotados: 0,
  criticos: 0,
  bajos: 0,
  sobrestock: 0,
  normales: 0,
}

export function useStockGeneral(params?: UseStockGeneralParams) {
  const [stock, setStock] = useState<StockGeneral[]>([])
  const [resumen, setResumen] = useState<StockGeneralResumen>(initialResumen)

  const [pagination, setPagination] = useState({
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 100,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStockGeneral = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response: GetStockGeneralResponse =
        await stockService.getStockGeneral({
          page: params?.page || 1,
          limit: params?.limit || 100,
          search: params?.search,
          sucursal_id: params?.sucursal_id,
        })

      setStock(response.stock || [])
      setResumen(response.resumen || initialResumen)

      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 100,
        totalPages: response.totalPages || 1,
      })
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Error al obtener el stock general'

      setError(message)
      setStock([])
      setResumen(initialResumen)
    } finally {
      setIsLoading(false)
    }
  }, [params?.page, params?.limit, params?.search, params?.sucursal_id])

  useEffect(() => {
    fetchStockGeneral()
  }, [fetchStockGeneral])

  return {
    stock,
    resumen,
    pagination,
    isLoading,
    error,
    refetch: fetchStockGeneral,
  }
}