import { useEffect, useState } from 'react'
import { proveedorService } from '../api/proveedorService'
import type { Proveedor } from '../types/proveedor.types'

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProveedores() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await proveedorService.getAll()

      setProveedores(response.proveedores || [])
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los proveedores',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  return {
    proveedores,
    isLoading,
    error,
    refetch: fetchProveedores,
  }
}