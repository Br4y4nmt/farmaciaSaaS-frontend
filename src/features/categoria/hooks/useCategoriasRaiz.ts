import { useCallback, useEffect, useState } from 'react'
import { categoriaService } from '../api/categoriaService'
import type { Categoria } from '../types/categoria.types'

export function useCategoriasRaiz(empresaId?: number) {
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
      const response = await categoriaService.getRaiz(empresaId)
      setCategorias(response.categorias || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener categorias'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

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
