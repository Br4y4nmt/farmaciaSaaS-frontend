export interface StockGeneral {
  id: number
  producto_id: number
  codigo?: string | null
  nombre_generico?: string | null
  nombre_comercial?: string | null
  categoria?: string | null
  laboratorio?: string | null
  marca?: string | null
  stock_total: number
  stock_minimo?: number | null
  unidad_medida?: string | null
  estado?: boolean
}

export interface GetStockGeneralResponse {
  stock: StockGeneral[]
}