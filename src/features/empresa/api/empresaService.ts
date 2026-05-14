import { api } from '../../../services/api'
import type {
  CreateEmpresaDto,
  GetEmpresasResponse,
} from '../types/empresa.types'

export const empresaService = {
  async getAll(): Promise<GetEmpresasResponse> {
    const { data } = await api.get('/empresas')
    return data.data
  },

  async create(payload: CreateEmpresaDto) {
    const { data } = await api.post('/empresas', payload)
    return data.data
  },

  async update(id: number, payload: Partial<CreateEmpresaDto>) {
    const { data } = await api.put(`/empresas/${id}`, payload)
    return data.data
  },
}