import { useState } from 'react'
import { usuarioService } from '../api/usuarioService'
import type { CreateUsuarioPayload } from '../types/usuario.types'

export function useCreateUsuario() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createUsuario(payload: CreateUsuarioPayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await usuarioService.createAdminEmpresa(payload)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo crear el usuario'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createUsuario,
    isLoading,
    error,
  }
}