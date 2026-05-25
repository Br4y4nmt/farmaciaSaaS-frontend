import { useState } from 'react'
import { proveedorService } from '../api/proveedorService'
import type { CreateProveedorPayload, Proveedor } from '../types/proveedor.types'

export function useUpdateProveedor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actualizarProveedor(
    id: number,
    payload: CreateProveedorPayload,
  ): Promise<Proveedor | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await proveedorService.update(id, payload)

      return response.data?.proveedor || null
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el proveedor',
      )

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    actualizarProveedor,
    isLoading,
    error,
    setError,
  }
}