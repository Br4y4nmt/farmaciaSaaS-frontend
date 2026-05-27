export type EstadoStock =
  | 'AGOTADO'
  | 'CRITICO'
  | 'BAJO'
  | 'NORMAL'
  | 'SOBRESTOCK'

export interface StockGeneral {
  producto_id: number
  empresa_id: number

  codigo: string | null
  codigo_barras: string | null
  codigo_sunat?: string | null

  nombre_generico: string | null
  nombre_comercial: string
  descripcion?: string | null

  categoria: string | null
  laboratorio: string | null
  marca: string | null

  unidad_medida: string | null

  precio_compra: number | string
  precio_venta: number | string

  stock_total: number
  stock_reservado: number
  stock_disponible: number
  stock_minimo: number
  stock_maximo: number

  estado: boolean
  estado_stock: EstadoStock
}

export interface StockGeneralResumen {
  total_productos: number
  agotados: number
  criticos: number
  bajos: number
  sobrestock: number
  normales: number
}

export interface GetStockGeneralResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  resumen: StockGeneralResumen
  stock: StockGeneral[]
}