import { api } from '../../../services/api'
import type {
  CreateLocalDto,
  GetLocalesResponse,
} from '../types/empresa.types'

export const localService = {
  async getAll(): Promise<GetLocalesResponse> {
    const { data } = await api.get('/sucursales/sucursales-empresa')
    return data
  },

  async create(payload: CreateLocalDto) {
    const { data } = await api.post('/sucursales/sucursal-empresa', payload)
    return data.sucursal
  },

  async update(id: number, payload: Partial<CreateLocalDto>) {
    const { data } = await api.put(`/sucursales/sucursal-empresa/${id}`, payload)
    return data.sucursal
  },

  async delete(id: number) {
    const { data } = await api.delete(`/sucursales//sucursales-empresa/${id}`)
    return data
  },
}