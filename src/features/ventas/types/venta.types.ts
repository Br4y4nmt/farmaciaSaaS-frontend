export type MetodoPago =
  | 'EFECTIVO'
  | 'YAPE'
  | 'PLIN'
  | 'TARJETA'
  | 'TRANSFERENCIA'

export type CreateVentaRapidaItem = {
  producto_id: number
  cantidad: number
}

export type CreateVentaRapidaPayload = {
  metodo_pago: MetodoPago
  monto_recibido?: number
  observacion?: string | null
  items: CreateVentaRapidaItem[]
}

export type VentaRapidaResponse = {
  ok: boolean
  message: string
  data: {
    id: number
    empresa_id: number
    sucursal_id: number
    usuario_id: number
    caja_id?: number | null
    tipo_comprobante: 'N_VENTA'
    serie?: string | null
    numero?: string | null
    cliente_nombre?: string | null
    subtotal: string | number
    igv: string | number
    total: string | number
    metodo_pago: MetodoPago
    monto_recibido: string | number
    vuelto: string | number
    estado: 'REGISTRADA' | 'ANULADA'
    created_at?: string
    updated_at?: string
  }
}