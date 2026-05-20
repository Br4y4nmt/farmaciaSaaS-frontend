import { api } from '../../../services/api'
import type {
  CreateLaboratorioDto,
  GetLaboratoriosResponse,
  UpdateLaboratorioDto,
} from '../types/laboratorio.types'

export async function createLaboratorio(data: CreateLaboratorioDto) {
  const response = await api.post('/laboratorios', data)
  return response.data?.data ?? response.data
}

export async function getLaboratorios(
  params?: {
    page?: number
    limit?: number
    estado?: boolean
    nombre?: string
  }
): Promise<GetLaboratoriosResponse> {
  const response = await api.get('/laboratorios', {
    params: {
      limit: 100,
      ...params,
    },
  })

  return response.data?.data ?? response.data
}

export async function updateLaboratorio(
  id: number,
  data: UpdateLaboratorioDto
) {
  const response = await api.put(`/laboratorios/${id}`, data)
  return response.data?.data ?? response.data
}

export async function deleteLaboratorio(id: number) {
  const response = await api.delete(`/laboratorios/${id}`)
  return response.data?.data ?? response.data
}