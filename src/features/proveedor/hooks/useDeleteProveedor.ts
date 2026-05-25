import { useState } from 'react'
import { proveedorService } from '../api/proveedorService'

export function useDeleteProveedor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function eliminarProveedor(id: number) {
    try {
      setIsLoading(true)
      setError(null)

      await proveedorService.delete(id)

      return true
    } catch (error) {
      console.error(error)
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el proveedor',
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    eliminarProveedor,
    isLoading,
    error,
    setError,
  }
}