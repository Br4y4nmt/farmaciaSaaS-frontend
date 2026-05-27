import type { AuthUser } from '../types/auth.types'

const STORAGE_KEY = 'auth_user'
const TOKEN_KEY = 'token'
const BIENVENIDA_KEY = 'showBienvenida'
const NOMBRE_KEY = 'nombre_usuario'

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return null

  try {
    const user = JSON.parse(raw) as AuthUser
    const token = localStorage.getItem(TOKEN_KEY)

    if (token && !user.token) {
      return {
        ...user,
        token,
      }
    }

    return user
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

  if (user.token) {
    localStorage.setItem(TOKEN_KEY, user.token)
  }

  if (user.nombres) {
    localStorage.setItem(NOMBRE_KEY, user.nombres)
  }
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(BIENVENIDA_KEY)
  localStorage.removeItem(NOMBRE_KEY)
}