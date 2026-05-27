import { api } from '../../../services/api'
import type { GetStockGeneralResponse } from '../types/inventario.types'

type GetStockGeneralParams = {
  page?: number
  limit?: number
  search?: string
  sucursal_id?: number | string
}

export const stockService = {
  async getStockGeneral(
    params?: GetStockGeneralParams,
  ): Promise<GetStockGeneralResponse> {
    const { data } = await api.get('/inventario/stock-general', {
      params,
    })

    return data.data
  },
}