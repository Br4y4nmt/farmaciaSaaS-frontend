export type MetodoPago = {
  id: number
  empresa_id?: number | null
  codigo: string
  nombre: string
  tipo: 'EFECTIVO' | 'DIGITAL' | 'TARJETA' | 'BANCO' | 'CREDITO' | 'OTRO'
  requiere_referencia: boolean
  estado: boolean
}

export type CreateVentaRapidaItem = {
  producto_id: number
  cantidad: number
}

export type CreateVentaRapidaPayload = {
  metodo_pago_id: number
  monto_recibido?: number
  referencia_pago?: string | null
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
    caja_id: number
    metodo_pago_id: number
    tipo_comprobante: 'N_VENTA'
    serie?: string | null
    numero?: string | null
    cliente_nombre?: string | null
    subtotal: string | number
    igv: string | number
    total: string | number
    monto_recibido: string | number
    vuelto: string | number
    referencia_pago?: string | null
    estado: 'REGISTRADA' | 'ANULADA'
    metodo_pago?: MetodoPago
    created_at?: string
    updated_at?: string
  }
}