export type TipoComprobante = 'FACTURA' | 'BOLETA' | 'GUIA' | 'TICKET' | 'OTRO'

export type EstadoCompra = 'BORRADOR' | 'REGISTRADA' | 'ANULADA'

export type CompraProveedor = {
  id: number
  tipo_documento?: string | null
  numero_documento?: string | null
  razon_social: string
  nombre_comercial?: string | null
  telefono?: string | null
  celular?: string | null
  correo?: string | null
}

export type CompraSucursal = {
  id: number
  nombre: string
  codigo?: string | null
}

export type CompraUsuario = {
  id: number
  nombres: string
  apellidos?: string | null
  correo?: string | null
}

export type CompraProducto = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_generico?: string | null
  nombre_comercial: string
  unidad_medida?: string | null
  precio_compra?: number | string
  precio_venta?: number | string
}

export type CompraDetalle = {
  id: number
  compra_id: number
  producto_id: number
  cantidad: number
  costo_unitario: number | string
  subtotal: number | string
  lote?: string | null
  fecha_vencimiento?: string | null
  estado: boolean
  producto?: CompraProducto | null
}

export type CompraLote = {
  id: number
  producto_id: number
  numero_lote: string
  fecha_vencimiento: string
  cantidad_inicial: number
  cantidad_actual: number
  costo_unitario: number | string
  estado_lote: string
}

export type Compra = {
  id: number
  empresa_id: number
  sucursal_id: number
  proveedor_id: number
  usuario_id?: number | null

  tipo_comprobante: TipoComprobante
  serie?: string | null
  numero?: string | null

  fecha_emision: string
  fecha_recepcion?: string | null

  subtotal: number | string
  igv: number | string
  total: number | string

  estado_compra: EstadoCompra
  observacion?: string | null
  estado: boolean

  created_at?: string
  updated_at?: string | null

  proveedor?: CompraProveedor | null
  sucursal?: CompraSucursal | null
  usuario?: CompraUsuario | null
  detalles?: CompraDetalle[]
  lotes?: CompraLote[]
}

export type GetComprasResponse = {
  ok: boolean
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    compras: Compra[]
  }
}

export type CreateCompraDetalleDto = {
  producto_id: number
  cantidad: number
  costo_unitario: number
  subtotal: number
  lote: string
  fecha_vencimiento: string
}

export type CreateCompraDto = {
  sucursal_id: number
  proveedor_id: number

  tipo_comprobante: TipoComprobante
  serie?: string
  numero?: string

  fecha_emision: string
  fecha_recepcion?: string

  subtotal: number
  igv: number
  total: number

  observacion?: string
  detalles: CreateCompraDetalleDto[]
}

export type CreateCompraResponse = {
  ok: boolean
  message: string
  data: {
    compra: Compra
  }
}