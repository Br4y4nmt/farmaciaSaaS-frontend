export interface Plan {
  id: number
  nombre: string
  descripcion?: string | null

  precio_mensual: number | string
  precio_anual?: number | string | null

  max_sucursales?: number | null
  max_usuarios?: number | null
  max_productos?: number | null
  max_comprobantes_mensuales?: number | null

  incluye_soporte?: boolean
  incluye_facturacion?: boolean
  incluye_reportes?: boolean
  incluye_multi_sucursal?: boolean
  incluye_backup?: boolean

  estado?: boolean
  created_at?: string
  updated_at?: string | null
}
export interface CreatePlanDto {
  nombre: string
  descripcion: string

  precio_mensual: number
  precio_anual: number

  max_sucursales: number | null
  max_usuarios: number | null
  max_productos: number | null
  max_comprobantes_mensuales: number | null

  incluye_soporte: boolean
  incluye_facturacion: boolean
  incluye_reportes: boolean
  incluye_multi_sucursal: boolean
  incluye_backup: boolean

  estado: boolean
}

export type UpdatePlanDto = CreatePlanDto
export interface GetPlanesResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  planes: Plan[]
}