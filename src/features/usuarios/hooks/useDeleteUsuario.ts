import { useState } from 'react'
import { usuarioService } from '../api/usuarioService'

export function useDeleteUsuario() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function deleteUsuario(id: number) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await usuarioService.deleteAdminEmpresa(id)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el usuario'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteUsuario,
    isLoading,
    error,
  }
}