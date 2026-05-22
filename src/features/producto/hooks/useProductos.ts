import { useCallback, useEffect, useState } from 'react'
import { getProductos } from '../api/productoService'
import type {
  GetProductosResponse,
  Producto,
} from '../types/producto.types'

type UseProductosParams = {
  page?: number
  limit?: number
  estado?: boolean
  nombre?: string
  categoria_id?: number
  laboratorio_id?: number
  marca_id?: number
}

export function useProductos(params?: UseProductosParams) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [pagination, setPagination] = useState<Omit<GetProductosResponse, 'productos'> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProductos = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await getProductos(params)

      setProductos(response.productos || [])
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      })
    } catch (err: any) {
      console.error('Error al cargar productos:', err)

      const message =
        err.response?.data?.message ||
        'No se pudieron cargar los productos'

      setError(message)
      setProductos([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }, [
    params?.page,
    params?.limit,
    params?.estado,
    params?.nombre,
    params?.categoria_id,
    params?.laboratorio_id,
    params?.marca_id,
  ])

  useEffect(() => {
    fetchProductos()
  }, [fetchProductos])

  return {
    productos,
    pagination,
    isLoading,
    error,
    refetch: fetchProductos,
  }
}