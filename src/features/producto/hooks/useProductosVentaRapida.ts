import { useEffect, useState } from 'react'
import { productoVentaService } from '../api/productoVentaService'
import type { ProductoVenta } from '../types/productoVenta.types'

export function useProductosVentaRapida() {
  const [productos, setProductos] = useState<ProductoVenta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProductos(buscar = '') {
    try {
      setIsLoading(true)
      setError(null)

      const data = await productoVentaService.getVentaRapida(buscar)

      setProductos(data)
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los productos'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  return {
    productos,
    isLoading,
    error,
    refetch: fetchProductos,
  }
}