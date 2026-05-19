import { useEffect, useState } from 'react'
import { getMarcas } from '../api/marcaService'
import type { Marca } from '../types/marca.types'

export function useMarcas(empresaId?: number) {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchMarcas() {
    if (!empresaId) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await getMarcas(empresaId)

      setMarcas(response.marcas)
    } catch (error) {
      console.error('Error al cargar marcas:', error)
      setError('No se pudieron cargar las marcas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarcas()
  }, [empresaId])

  return {
    marcas,
    isLoading,
    error,
    refetch: fetchMarcas,
  }
}