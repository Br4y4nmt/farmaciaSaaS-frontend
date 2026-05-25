import { useState } from 'react'
import { proveedorService } from '../api/proveedorService'
import type { CreateProveedorPayload, Proveedor } from '../types/proveedor.types'

export function useCreateProveedor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function crearProveedor(
    payload: CreateProveedorPayload,
  ): Promise<Proveedor | null> {
    try {
      setIsLoading(true)
      setError(null)

      const response = await proveedorService.create(payload)

      return response.data?.proveedor || null
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el proveedor',
      )

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    crearProveedor,
    isLoading,
    error,
    setError,
  }
}