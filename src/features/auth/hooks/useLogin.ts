import { useState } from 'react'
import { authService } from '../api/authService'
import type { LoginCredentials, AuthUser } from '../types/auth.types'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
    setIsLoading(true)
    setError(null)

    try {
      const { token, user } = await authService.login(credentials)

      localStorage.setItem('token', token)

      return { ...user, token }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.message === 'Network Error'
          ? 'No se pudo conectar con el servidor'
          : 'Error inesperado, intenta de nuevo')

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}