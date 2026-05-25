import type {
  CreateProveedorPayload,
  ProveedorResponse,
} from '../types/proveedor.types'

const API_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem('token')
}

export const proveedorService = {
  async getAll(): Promise<ProveedorResponse['data']> {
    const token = getToken()

    const response = await fetch(`${API_URL}/proveedores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al listar proveedores')
    }

    return data.data
  },

  async create(payload: CreateProveedorPayload) {
    const token = getToken()

    const response = await fetch(`${API_URL}/proveedores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear proveedor')
    }

    return data
  },

  async delete(id: number) {
    const token = getToken()

    const response = await fetch(`${API_URL}/proveedores/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar proveedor')
    }

    return data
  },
  
  async update(id: number, payload: CreateProveedorPayload) {
    const token = getToken()

    const response = await fetch(`${API_URL}/proveedores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar proveedor')
    }

    return data
  }
}