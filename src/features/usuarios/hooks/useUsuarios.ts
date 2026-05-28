import { useEffect, useState } from 'react'
import { usuarioService } from '../api/usuarioService'
import type { Usuario } from '../types/usuario.types'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchUsuarios() {
    try {
      setIsLoading(true)
      setError(null)

      const data = await usuarioService.getAllAdminEmpresa()
      setUsuarios(data)
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los usuarios'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return {
    usuarios,
    isLoading,
    error,
    refetch: fetchUsuarios,
  }
}