export interface LoginCredentials {
  correo: string
  password: string
}

export interface AuthUser {
  id: number
  rol_id: number
  empresa_id: number
  correo?: string
  token: string
  [key: string]: unknown
}

export interface AuthLoginResponse {
  token: string
  user: AuthUser
}

export interface LoginApiResponse {
  ok: boolean
  message: string
  data: AuthLoginResponse
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
