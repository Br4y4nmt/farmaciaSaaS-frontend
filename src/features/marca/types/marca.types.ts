export type Marca = {
  id: number
  empresa_id: number
  nombre: string
  codigo: string
  descripcion: string | null
  estado: boolean
  total_productos: number
  created_at: string
  updated_at: string
}

export type CreateMarcaDto = {
  empresa_id: number
  nombre: string
  descripcion?: string | null
}

export type UpdateMarcaDto = {
  empresa_id?: number
  nombre?: string
  descripcion?: string | null
  estado?: boolean
}

export type GetMarcasResponse = {
  total: number
  page: number
  limit: number
  totalPages: number
  marcas: Marca[]
}