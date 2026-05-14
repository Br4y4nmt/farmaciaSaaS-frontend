export interface CreateEmpresaDto {
  nombre: string
  ruc?: string
  direccion?: string
  telefono?: string
  correo?: string
  plan_id?: number
  fecha_inicio?: string
  fecha_vencimiento?: string

  admin_nombres: string
  admin_apellidos: string
  admin_correo: string
  admin_password: string
  admin_telefono?: string
}

export interface Empresa {
  id: number
  nombre: string
  ruc?: string
  direccion?: string
  telefono?: string
  correo?: string
  estado?: boolean
  created_at?: string
}

export interface GetEmpresasResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  empresas: Empresa[]
}