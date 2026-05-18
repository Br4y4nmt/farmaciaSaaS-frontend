export interface Role {
  id: number
  codigo: string
  nombre: string
}

export interface GetRolesResponse {
  roles: Role[]
}