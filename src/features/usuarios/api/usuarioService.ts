import type {
  CreateUsuarioPayload,
  CreateUsuarioResponse,
  UsuariosResponse,
  UpdateUsuarioPayload,
  UpdateUsuarioResponse,
} from '../types/usuario.types'

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

export const usuarioService = {
  async getAllAdminEmpresa(): Promise<UsuariosResponse['data']> {
    const response = await fetch(`${API_URL}/usuarios/admin-empresa`, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al listar usuarios')
    }

    return data.data
  },

  async createAdminEmpresa(
    payload: CreateUsuarioPayload
  ): Promise<CreateUsuarioResponse> {
    const response = await fetch(`${API_URL}/usuarios/admin-empresa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario')
    }

    return data
  },

  
    async deleteAdminEmpresa(id: number) {
    const response = await fetch(`${API_URL}/usuarios/admin-empresa/${id}`, {
        method: 'DELETE',
        headers: {
        ...getAuthHeaders(),
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario')
    }

    return data
    },



  async updateAdminEmpresa(
    id: number,
    payload: UpdateUsuarioPayload
  ): Promise<UpdateUsuarioResponse> {
    const response = await fetch(`${API_URL}/usuarios/admin-empresa/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario')
    }

    return data
  },
}