import { useState } from 'react'
import { deleteProducto } from '../api/productoService'

export function useDeleteProducto() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function eliminarProducto(id: number): Promise<boolean> {
    try {
      setIsLoading(true)
      setError(null)

      await deleteProducto(id)

      return true
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'No se pudo eliminar el producto'

      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    eliminarProducto,
    isLoading,
    error,
    setError,
  }
}