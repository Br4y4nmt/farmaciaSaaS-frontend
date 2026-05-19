import { api } from '../../../services/api'

import type {
  Marca,
  CreateMarcaDto,
  GetMarcasResponse,
  UpdateMarcaDto,
} from '../types/marca.types'

export async function createMarca(
  data: CreateMarcaDto
): Promise<Marca> {
  const response = await api.post(
    '/marcas',
    data
  )

  return response.data?.data ?? response.data
}

export async function getMarcas(
  empresaId: number,
  params?: {
    page?: number
    limit?: number
    estado?: boolean
    nombre?: string
  }
): Promise<GetMarcasResponse> {
  const response = await api.get(
    '/marcas',
    {
      params: {
        empresa_id: empresaId,
        limit: 100,
        ...params,
      },
    }
  )

  return response.data?.data ?? response.data
}

export async function updateMarca(
  id: number,
  data: UpdateMarcaDto
): Promise<Marca> {
  const response = await api.put(
    `/marcas/${id}`,
    data
  )

  return response.data?.data ?? response.data
}

export async function deleteMarca(
  id: number
): Promise<void> {
  await api.delete(
    `/marcas/${id}`
  )
}