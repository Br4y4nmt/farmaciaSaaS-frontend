import { useCallback, useEffect, useState } from 'react'
import { sucursalService } from '../api/sucursalService'
import type { Sucursal } from '../types/empresa.types'

export function useSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSucursales = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await sucursalService.getAll()
      setSucursales(response.sucursales || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener sucursales'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSucursales()
  }, [fetchSucursales])

  return {
    sucursales,
    isLoading,
    error,
    refetch: fetchSucursales,
  }
}