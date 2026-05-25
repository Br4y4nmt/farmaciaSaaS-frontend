import { useCallback, useEffect, useState } from 'react'
import { loteService } from '../api/loteService'
import type { Lote } from '../types/lote.types'

export function useLotes() {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loteService.getAll()
      setLotes(response.lotes || [])
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'No se pudieron cargar los lotes'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLotes()
  }, [fetchLotes])

  return {
    lotes,
    isLoading,
    error,
    refetch: fetchLotes,
  }
}