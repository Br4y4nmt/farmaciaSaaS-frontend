import { useCallback, useEffect, useState } from 'react'
import { categoriaService } from '../api/categoriaService'
import type { Categoria } from '../types/categoria.types'

type UseCategoriasParams = {
  page?: number
  limit?: number
  estado?: boolean
  nombre?: string
}

export function useCategorias(
  empresaId?: number,
  params?: UseCategoriasParams,
) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategorias = useCallback(async () => {
    if (!empresaId) {
      setCategorias([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await categoriaService.getAll(empresaId, params)

      setCategorias(response.categorias || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener categorias'

      setError(message)
      setCategorias([])
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
    fetchCategorias()
  }, [fetchCategorias])

  return {
    categorias,
    isLoading,
    error,
    refetch: fetchCategorias,
  }
}