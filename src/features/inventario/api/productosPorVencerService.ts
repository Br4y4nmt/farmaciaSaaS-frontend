import { api } from '../../../services/api'
import type { Lote } from '../types/lote.types'

export type ProductosPorVencerResumen = {
  vencidos: number
  vence_30: number
  vence_60: number
  vence_90: number
}

export type GetProductosPorVencerResponse = {
  ok: boolean
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    dias: number
    fecha_actual: string
    fecha_limite: string
    resumen: ProductosPorVencerResumen
    productos_por_vencer: Lote[]
  }
}

export const productosPorVencerService = {
  async getAll(dias = 90): Promise<GetProductosPorVencerResponse['data']> {
    const { data } = await api.get<GetProductosPorVencerResponse>(
      `/lotes/productos-por-vencer?dias=${dias}`,
    )

    return data.data
  },
}