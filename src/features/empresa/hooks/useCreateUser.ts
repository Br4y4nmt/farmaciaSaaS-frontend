import { useState } from 'react'
import { usuarioService } from '../api/usuarioService'

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createUser(payload: any) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await usuarioService.create(payload)
      return res
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createUser, isLoading, error }
}
