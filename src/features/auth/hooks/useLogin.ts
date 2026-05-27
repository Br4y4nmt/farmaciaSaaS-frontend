import { useState } from 'react'
import { authService } from '../api/authService'
import type { LoginCredentials, AuthUser } from '../types/auth.types'

type LoginResult = { user: AuthUser; errorMessage: null } | { user: null; errorMessage: string }

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)

  async function login(credentials: LoginCredentials): Promise<LoginResult> {
    setIsLoading(true)

    try {
      const { token, user } = await authService.login(credentials)

      return {
        user: { ...user, token },
        errorMessage: null,
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.message === 'Network Error'
          ? 'No se pudo conectar con el servidor'
          : 'Error inesperado, intenta de nuevo')

      return { user: null, errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
  }
}