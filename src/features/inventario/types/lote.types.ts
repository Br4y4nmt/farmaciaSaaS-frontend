export type EstadoLote =
  | 'DISPONIBLE'
  | 'AGOTADO'
  | 'VENCIDO'
  | 'BLOQUEADO'
  | 'ANULADO'

export type LoteProducto = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_generico?: string | null
  nombre_comercial: string
  unidad_medida?: string | null
  precio_compra?: number | string
  precio_venta?: number | string
  stock_minimo?: number
}

export type LoteSucursal = {
  id: number
  nombre: string
  codigo?: string | null

  direccion_fiscal?: string | null
  direccion_comercial?: string | null
  departamento?: string | null
  provincia?: string | null
  distrito?: string | null
}

export type LoteCompra = {
  id: number
  tipo_comprobante?: string | null
  serie?: string | null
  numero?: string | null
  fecha_emision?: string | null
  fecha_recepcion?: string | null
  estado_compra?: string | null
}

export type Lote = {
  id: number
  empresa_id: number
  sucursal_id: number
  producto_id: number
  compra_id?: number | null
  compra_detalle_id?: number | null

  numero_lote: string
  fecha_fabricacion?: string | null
  fecha_vencimiento: string

  cantidad_inicial: number
  cantidad_actual: number

  costo_unitario: number | string

  estado_lote: EstadoLote
  observacion?: string | null
  estado: boolean

  created_at?: string
  updated_at?: string

  producto?: LoteProducto | null
  sucursal?: LoteSucursal | null
  compra?: LoteCompra | null
}

export type GetLotesResponse = {
  ok: boolean
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    lotes: Lote[]
  }
}