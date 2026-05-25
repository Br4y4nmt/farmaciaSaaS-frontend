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
  plan_id?: number | null
  plan?: {
    id: number
    nombre: string
  } | null
  fecha_inicio?: string | null
  fecha_vencimiento?: string | null
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

export interface UsuarioEmpresaResumen {
  id: number
  nombres: string
  apellidos: string
  correo: string
  telefono?: string | null
  rol_id: number
  rol_nombre?: string | null
  estado: boolean
}

export interface EmpresaUsuariosResumen {
  id: number
  nombre: string
  ruc?: string
  estado: boolean

  totalUsuarios: number
  plan?: {
    id: number
    nombre: string
  } | null

  usuarios: UsuarioEmpresaResumen[]
}

export interface GetEmpresasUsuariosResumenResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  empresas: EmpresaUsuariosResumen[]
}

export interface CreateSucursalDto {
  empresa_id: number
  nombre: string
  codigo?: string
  direccion_fiscal?: string
  direccion_comercial?: string
  departamento?: string
  provincia?: string
  distrito?: string
  telefono?: string
  correo_contacto?: string
  responsable?: string
  estado?: boolean
}

export interface Sucursal {
  id: number
  empresa_id: number
  empresa?: {
    id: number
    nombre: string
    ruc?: string | null
  } | null
  nombre: string
  codigo?: string | null
  direccion_fiscal?: string | null
  direccion_comercial?: string | null
  departamento?: string | null
  provincia?: string | null
  distrito?: string | null
  telefono?: string | null
  correo_contacto?: string | null
  responsable?: string | null
  estado: boolean
  created_at?: string
  updated_at?: string
}

export interface GetSucursalesResponse {
  sucursales: Sucursal[]
}

export interface CreateLocalDto {
  nombre: string
  direccion_fiscal?: string
  direccion_comercial?: string
  departamento?: string
  provincia?: string
  distrito?: string
  telefono?: string
  correo_contacto?: string
  responsable?: string
  estado?: boolean
}

export interface GetLocalesResponse {
  sucursales: Sucursal[]
}