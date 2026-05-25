import { api } from '../../../services/api'
import type { GetMovimientosStockResponse } from '../types/movimientoStock.types'

export const movimientoStockService = {
  async getAll(): Promise<GetMovimientosStockResponse['data']> {
    const { data } =
      await api.get<GetMovimientosStockResponse>('/movimientos-stock')

    return data.data
  },
}