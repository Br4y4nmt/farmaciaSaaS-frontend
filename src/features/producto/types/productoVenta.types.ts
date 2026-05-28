export type ProductoVenta = {
  id: number
  codigo: string
  codigo_barras: string | null
  nombre_comercial: string
  nombre_generico?: string | null
  precio_venta: number
  imagen_url?: string | null
  requiere_receta: boolean
  es_controlado: boolean
  es_fraccionable: boolean
  afecto_igv: boolean
  inventario_id: number | null
  stock_actual: number
  stock_reservado: number
  stock_disponible: number
  ubicacion?: string | null
}

export type ProductosVentaRapidaResponse = {
  ok: boolean
  data: ProductoVenta[]
}