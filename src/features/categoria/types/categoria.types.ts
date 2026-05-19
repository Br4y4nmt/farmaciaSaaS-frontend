export interface CreateCategoriaDto {
  empresa_id: number
  parent_id?: number | null
  nombre: string
  descripcion?: string | null
  orden?: number | null
  estado?: boolean
}

export interface UpdateCategoriaDto {
  parent_id?: number | null
  nombre?: string
  descripcion?: string | null
  orden?: number | null
  estado?: boolean
}

export interface Categoria {
  id: number
  empresa_id: number
  parent_id?: number | null
  nombre: string
  categoria_padre?: {
    id: number
    nombre: string
  } | null
  descripcion?: string | null
  orden?: number | null
  estado?: boolean
  created_at?: string
  updated_at?: string
}

export interface GetCategoriasRaizResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  categorias: Categoria[]
}

export interface GetCategoriasResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  categorias: Categoria[]
}
