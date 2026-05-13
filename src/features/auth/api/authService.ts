import { api } from '../../../services/api'
import type {
  LoginCredentials,
  AuthLoginResponse,
  LoginApiResponse,
} from '../types/auth.types'
 
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthLoginResponse> {
    const payload = {
      correo: credentials.correo,
      password: credentials.password,
    }

    const { data } = await api.post<LoginApiResponse>('/auth/login', payload)
    return data.data
  },
 
  logout() {
    localStorage.removeItem('token')
  },
}
 