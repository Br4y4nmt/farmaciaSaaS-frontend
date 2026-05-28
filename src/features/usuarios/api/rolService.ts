import type {
  RolesResponse,
  RolPermisosResponse,
} from '../types/rol.types'

const API_URL = import.meta.env.VITE_API_URL

function getToken() {
  const directToken = localStorage.getItem('token')

  if (directToken) {
    return directToken
  }

  const authStorage = localStorage.getItem('auth-storage')

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)

      return (
        parsed?.state?.token ||
        parsed?.token ||
        parsed?.state?.user?.token ||
        parsed?.user?.token ||
        null
      )
    } catch (error) {
      console.error('Error leyendo auth-storage:', error)
    }
  }

  const authUser = localStorage.getItem('auth_user')

  if (authUser) {
    try {
      const parsed = JSON.parse(authUser)

      return parsed?.token || parsed?.accessToken || null
    } catch (error) {
      console.error('Error leyendo auth_user:', error)
    }
  }

  return null
}

function getAuthHeaders() {
  const token = getToken()

  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export const rolService = {
  async getRolesAdminEmpresa(): Promise<RolesResponse['data']> {
    const response = await fetch(`${API_URL}/roles/admin-empresa`, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al listar roles')
    }

    return data.data
  },

  async getPermisosByRol(id: number): Promise<RolPermisosResponse['data']> {
    const response = await fetch(`${API_URL}/roles/${id}/permisos`, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al listar permisos del rol')
    }

    return data.data
  },
}