import { api } from '../../../services/api'
import type { Producto } from '../types/producto.types'

export async function createProducto(data: FormData): Promise<Producto> {
  const response = await api.post('/productos', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data?.data ?? response.data
}