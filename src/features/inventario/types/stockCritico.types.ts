export type EstadoStockCritico = 'SIN_STOCK' | 'CRITICO' | 'BAJO' | 'NORMAL'

export type StockCriticoProducto = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_generico?: string | null
  nombre_comercial: string
  unidad_medida?: string | null
  stock_minimo: number
  stock_maximo: number
  precio_compra?: number | string
  precio_venta?: number | string
  estado?: boolean
}

export type StockCriticoSucursal = {
  id: number
  nombre: string
  codigo?: string | null
}

export type StockCritico = {
  id: number
  empresa_id: number
  sucursal_id: number
  producto_id: number

  stock_actual: number
  stock_reservado: number
  stock_disponible: number

  stock_minimo: number
  stock_maximo: number

  estado_stock: EstadoStockCritico

  estado: boolean
  created_at?: string
  updated_at?: string

  producto?: StockCriticoProducto | null
  sucursal?: StockCriticoSucursal | null
}

export type StockCriticoResumen = {
  sin_stock: number
  critico: number
  bajo: number
  total: number
}

export type GetStockCriticoResponse = {
  ok: boolean
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    resumen: StockCriticoResumen
    stock_critico: StockCritico[]
  }
}