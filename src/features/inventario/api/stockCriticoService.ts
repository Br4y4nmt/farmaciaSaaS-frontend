import { api } from '../../../services/api'
import type { GetStockCriticoResponse } from '../types/stockCritico.types'

export const stockCriticoService = {
  async getAll(): Promise<GetStockCriticoResponse['data']> {
    const { data } =
      await api.get<GetStockCriticoResponse>('/inventario/stock-critico')

    return data.data
  },
}