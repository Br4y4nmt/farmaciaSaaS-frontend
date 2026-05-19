export interface CreateLaboratorioDto {
  empresa_id: number
  nombre: string
  descripcion?: string | null
}

export interface UpdateLaboratorioDto {
  nombre?: string
  descripcion?: string | null
  estado?: boolean
}

export interface Laboratorio {
  id: number
  empresa_id: number
  nombre: string
  codigo?: string | null
  descripcion?: string | null
  estado?: boolean
  total_productos?: number | null
  created_at?: string
  updated_at?: string
}

export interface GetLaboratoriosResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  laboratorios: Laboratorio[]
}
