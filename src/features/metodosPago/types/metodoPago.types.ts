export type MetodoPago = {
  id: number
  empresa_id?: number | null
  codigo: string
  nombre: string
  tipo: 'EFECTIVO' | 'DIGITAL' | 'TARJETA' | 'BANCO' | 'CREDITO' | 'OTRO'
  requiere_referencia: boolean
  estado: boolean
}

export type MetodoPagoResponse = {
  ok: boolean
  data: MetodoPago[]
}