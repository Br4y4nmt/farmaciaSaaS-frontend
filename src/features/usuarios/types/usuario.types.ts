export type CreateUsuarioPayload = {
  nombres: string
  apellidos: string
  correo: string
  password: string
  telefono?: string | null
  rol_id: number
  sucursal_id: number
  estado: boolean
}

export type UsuarioRol = {
  id: number
  codigo: string
  nombre: string
}

export type UsuarioSucursal = {
  id: number
  nombre: string
  codigo?: string | null
}

export type Usuario = {
  id: number
  empresa_id: number
  sucursal_id: number | null
  rol_id: number
  nombres: string
  apellidos: string
  correo: string
  telefono?: string | null
  estado: boolean
  ultimo_acceso?: string | null
  created_at?: string

  rol?: UsuarioRol | null
  sucursal?: UsuarioSucursal | null
}

export type CreateUsuarioResponse = {
  ok: boolean
  message: string
  data: Usuario
}

export type UsuariosResponse = {
  ok: boolean
  data: Usuario[]
}

export type UpdateUsuarioPayload = {
  nombres: string
  apellidos: string
  correo: string
  telefono?: string | null
  rol_id: number
  sucursal_id: number
  estado: boolean
  password?: string
}

export type UpdateUsuarioResponse = {
  ok: boolean
  message: string
  data: Usuario
}