import { api } from '../../../services/api'
import type { GetStockGeneralResponse } from '../types/inventario.types'

export const stockService = {
  async getStockGeneral(): Promise<GetStockGeneralResponse> {
    const { data } = await api.get('/inventario/stock-general')
    return data
  },
}