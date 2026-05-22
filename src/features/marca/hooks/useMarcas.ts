import { useCallback, useEffect, useState } from 'react'
import { getMarcas } from '../api/marcaService'
import type { Marca } from '../types/marca.types'

type UseMarcasParams = {
  page?: number
  limit?: number
  estado?: boolean
  nombre?: string
}

export function useMarcas(
  empresaId?: number,
  params?: UseMarcasParams,
) {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarcas = useCallback(async () => {
    if (!empresaId) {
      setMarcas([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await getMarcas(empresaId, params)

      setMarcas(response.marcas || [])
    } catch (error) {
      console.error('Error al cargar marcas:', error)
      setError('No se pudieron cargar las marcas')
      setMarcas([])
    } finally {
      setIsLoading(false)
    }
  }, [
    empresaId,
    params?.page,
    params?.limit,
    params?.estado,
    params?.nombre,
  ])

  useEffect(() => {
    fetchMarcas()
  }, [fetchMarcas])

  return {
    marcas,
    isLoading,
    error,
    refetch: fetchMarcas,
  }
}