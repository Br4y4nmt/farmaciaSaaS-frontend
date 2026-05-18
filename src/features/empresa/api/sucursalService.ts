import { api } from '../../../services/api'
import type {
  CreateSucursalDto,
  GetSucursalesResponse,
} from '../types/empresa.types'

export const sucursalService = {
  async getAll(): Promise<GetSucursalesResponse> {
    const { data } = await api.get('/sucursales')
    return data
  },

  async create(payload: CreateSucursalDto) {
    const { data } = await api.post('/sucursales', payload)
    return data.sucursal
  },

  async update(id: number, payload: Partial<CreateSucursalDto>) {
  const { data } = await api.put(`/sucursales/${id}`, payload)
  return data.sucursal
  },
  
  async delete(id: number) {
  const { data } = await api.delete(`/sucursales/${id}`)
  return data
  },
}