export type TipoMovimientoStock =
  | 'INGRESO_COMPRA'
  | 'SALIDA_VENTA'
  | 'AJUSTE_ENTRADA'
  | 'AJUSTE_SALIDA'
  | 'DEVOLUCION_CLIENTE'
  | 'DEVOLUCION_PROVEEDOR'
  | 'TRASLADO_ENTRADA'
  | 'TRASLADO_SALIDA'
  | 'ANULACION_COMPRA'
  | 'ANULACION_VENTA'

export type NaturalezaMovimientoStock = 'ENTRADA' | 'SALIDA'

export type ReferenciaMovimientoStock =
  | 'COMPRA'
  | 'VENTA'
  | 'AJUSTE'
  | 'DEVOLUCION'
  | 'TRASLADO'
  | 'ANULACION'
  | 'MANUAL'

export type MovimientoStockProducto = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_generico?: string | null
  nombre_comercial: string
  unidad_medida?: string | null
  precio_compra?: number | string
  precio_venta?: number | string
}

export type MovimientoStockSucursal = {
  id: number
  nombre: string
  codigo?: string | null
}

export type MovimientoStockLote = {
  id: number
  numero_lote: string
  fecha_vencimiento?: string | null
  cantidad_inicial?: number
  cantidad_actual?: number
  estado_lote?: string
}

export type MovimientoStockUsuario = {
  id: number
  nombres: string
  apellidos?: string | null
  correo?: string | null
}

export type MovimientoStock = {
  id: number
  empresa_id: number
  sucursal_id: number
  producto_id: number
  lote_id?: number | null
  usuario_id?: number | null

  tipo_movimiento: TipoMovimientoStock
  naturaleza: NaturalezaMovimientoStock

  cantidad: number
  stock_anterior: number
  stock_nuevo: number

  costo_unitario?: number | string | null

  referencia_tipo: ReferenciaMovimientoStock
  referencia_id?: number | null

  motivo?: string | null
  observacion?: string | null

  estado: boolean

  created_at?: string
  updated_at?: string

  producto?: MovimientoStockProducto | null
  sucursal?: MovimientoStockSucursal | null
  lote?: MovimientoStockLote | null
  usuario?: MovimientoStockUsuario | null
}

export type GetMovimientosStockResponse = {
  ok: boolean
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    movimientos: MovimientoStock[]
  }
}