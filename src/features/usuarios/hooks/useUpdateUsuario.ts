import { useState } from 'react'
import { usuarioService } from '../api/usuarioService'
import type { UpdateUsuarioPayload } from '../types/usuario.types'

export function useUpdateUsuario() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateUsuario(id: number, payload: UpdateUsuarioPayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await usuarioService.updateAdminEmpresa(id, payload)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el usuario'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUsuario,
    isLoading,
    error,
  }
}