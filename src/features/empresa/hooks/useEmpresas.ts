import { useEffect, useState } from 'react'
import { empresaService } from '../api/empresaService'
import type { Empresa } from '../types/empresa.types'

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchEmpresas() {
    setIsLoading(true)
    setError(null)

    try {
      const res = await empresaService.getAll()
      const list = res.empresas || []
      setEmpresas([...list].sort((a, b) => a.id - b.id))
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Error al cargar empresas'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmpresas()
  }, [])

  return {
    empresas,
    isLoading,
    error,
    refetch: fetchEmpresas,
  }
}