import { api } from '../../../services/api'
import type {
  CreateCompraDto,
  CreateCompraResponse,
  GetComprasResponse,
} from '../types/compra.types'

export const compraService = {
  async getAll(): Promise<GetComprasResponse['data']> {
    const { data } = await api.get<GetComprasResponse>('/compras')
    return data.data
  },

  async create(payload: CreateCompraDto): Promise<CreateCompraResponse> {
    const { data } = await api.post<CreateCompraResponse>('/compras', payload)
    return data
  },

  async anular(id: number, motivo?: string) {
    const { data } = await api.put(`/compras/${id}/anular`, {
      motivo,
    })

    return data
  },
}