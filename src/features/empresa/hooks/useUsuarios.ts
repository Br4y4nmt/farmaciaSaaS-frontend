import { useEffect, useState } from 'react'
import { usuarioService } from '../api/usuarioService'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchUsuarios() {
    setIsLoading(true)
    setError(null)

    try {
      const res = await usuarioService.getAll()
      const list = res.usuarios || res.users || []
      setUsuarios([...list].sort((a: any, b: any) => a.id - b.id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return { usuarios, isLoading, error, refetch: fetchUsuarios }
}
