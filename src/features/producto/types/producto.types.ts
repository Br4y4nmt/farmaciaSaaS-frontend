export type Producto = {
  id: number
  empresa_id: number
  categoria_id: number | null
  laboratorio_id: number | null
  marca_id: number | null

  codigo: string
  codigo_barras: string | null
  codigo_sunat?: string | null

  nombre_generico: string | null
  nombre_comercial: string
  descripcion: string | null

  registro_sanitario?: string | null
  forma_farmaceutica?: string | null
  concentracion: string | null
  presentacion: string | null
  unidad_medida: string | null
  principio_activo: string | null

  requiere_receta: boolean
  es_controlado: boolean
  es_fraccionable: boolean
  afecto_igv: boolean
  estado: boolean

  precio_compra: number
  precio_venta: number
  stock_minimo: number
  stock_maximo: number

  imagen_url?: string | null

  created_at?: string
  updated_at?: string
}