import { api } from '../../../services/api'
import type { GetLotesResponse } from '../types/lote.types'

export const loteService = {
  async getAll(): Promise<GetLotesResponse['data']> {
    const { data } = await api.get<GetLotesResponse>('/lotes')
    return data.data
  },
}