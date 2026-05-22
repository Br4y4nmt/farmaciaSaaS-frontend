import { api } from '../../../services/api'
import type { Producto, GetProductosResponse } from '../types/producto.types'

export async function createProducto(data: FormData): Promise<Producto> {
  const response = await api.post('/productos', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data?.data ?? response.data
}
export async function getProductos(
  params?: {
    page?: number
    limit?: number
    estado?: boolean
    nombre?: string
    categoria_id?: number
    laboratorio_id?: number
    marca_id?: number
  },
): Promise<GetProductosResponse> {
  const response = await api.get('/productos', {
    params: {
      page: 1,
      limit: 100,
      ...params,
    },
  })

  return response.data?.data ?? response.data
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`)
}