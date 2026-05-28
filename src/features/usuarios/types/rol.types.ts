export type Rol = {
  id: number
  codigo: string
  nombre: string
}

export type Permiso = {
  id: number
  codigo: string
  nombre: string
  descripcion?: string | null
}

export type RolConPermisos = Rol & {
  permisos: Permiso[]
}

export type RolesResponse = {
  ok: boolean
  data: Rol[]
}

export type RolPermisosResponse = {
  ok: boolean
  data: RolConPermisos
}