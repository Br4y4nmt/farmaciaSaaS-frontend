import { useState } from 'react'
import { createProducto } from '../api/productoService'
import type { Producto } from '../types/producto.types'

export function useCreateProducto() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function crearProducto(payload: FormData): Promise<Producto | null> {
    try {
      setIsLoading(true)
      setError(null)

      const producto = await createProducto(payload)

      return producto
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'No se pudo crear el producto'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    crearProducto,
    isLoading,
    error,
    setError,
  }
}