export type EstadoCaja = 'ABIERTA' | 'CERRADA' | 'ANULADA'

export type TipoMetodoPago =
  | 'EFECTIVO'
  | 'DIGITAL'
  | 'TARJETA'
  | 'BANCO'
  | 'CREDITO'
  | 'OTRO'

export type ResumenPagoCaja = {
  metodo_pago_id: number
  codigo: string
  nombre: string
  tipo: TipoMetodoPago
  total: string | number
}

export type ResumenCaja = {
  total_ventas: string | number
  total_efectivo: string | number
  monto_esperado_actual?: string | number
  monto_esperado?: string | number
  diferencia?: string | number
  resumen_pagos: ResumenPagoCaja[]
}

export type Caja = {
  id: number
  empresa_id: number
  sucursal_id: number
  usuario_id: number
  codigo?: string | null
  fecha_apertura: string
  fecha_cierre?: string | null
  monto_inicial: string | number
  monto_final?: string | number | null
  total_ventas: string | number
  total_ingresos: string | number
  total_egresos: string | number
  monto_esperado?: string | number | null
  diferencia?: string | number | null
  observacion_apertura?: string | null
  observacion_cierre?: string | null
  estado: EstadoCaja
  created_at?: string
  updated_at?: string
}

export type EstadoCajaResponse = {
  ok: boolean
  data: {
    tieneCajaAbierta: boolean
    caja: Caja | null
    resumen: ResumenCaja | null
  }
}

export type AbrirCajaPayload = {
  monto_inicial: number
  observacion_apertura?: string | null
}

export type CerrarCajaPayload = {
  monto_final: number
  observacion_cierre?: string | null
}

export type AbrirCajaResponse = {
  ok: boolean
  message: string
  data: Caja
}

export type CerrarCajaResponse = {
  ok: boolean
  message: string
  data: {
    caja: Caja
    resumen: ResumenCaja
  }
}

export type CajaActionResponse = AbrirCajaResponse | CerrarCajaResponse