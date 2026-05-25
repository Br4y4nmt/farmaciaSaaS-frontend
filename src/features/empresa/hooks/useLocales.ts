import { useCallback, useEffect, useState } from 'react'
import { localService } from '../api/localService'
import type { Sucursal } from '../types/empresa.types'

export function useLocales() {
  const [locales, setLocales] = useState<Sucursal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLocales = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await localService.getAll()
      setLocales(response.sucursales || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener locales / sucursales'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocales()
  }, [fetchLocales])

  return {
    locales,
    isLoading,
    error,
    refetch: fetchLocales,
  }
}