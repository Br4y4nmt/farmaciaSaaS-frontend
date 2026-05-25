import { useCallback, useEffect, useState } from 'react'
import {
  productosPorVencerService,
  type ProductosPorVencerResumen,
} from '../api/productosPorVencerService'
import type { Lote } from '../types/lote.types'

const initialResumen: ProductosPorVencerResumen = {
  vencidos: 0,
  vence_30: 0,
  vence_60: 0,
  vence_90: 0,
}

export function useProductosPorVencer(dias = 90) {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [resumen, setResumen] =
    useState<ProductosPorVencerResumen>(initialResumen)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProductosPorVencer = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await productosPorVencerService.getAll(dias)

      setLotes(response.productos_por_vencer || [])
      setResumen(response.resumen || initialResumen)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudieron cargar los productos por vencer'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [dias])

  useEffect(() => {
    fetchProductosPorVencer()
  }, [fetchProductosPorVencer])

  return {
    lotes,
    resumen,
    isLoading,
    error,
    refetch: fetchProductosPorVencer,
  }
}