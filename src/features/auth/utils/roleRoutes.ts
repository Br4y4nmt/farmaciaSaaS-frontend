export const ROLE_PATHS = {
  SUPER_ADMIN: '/super-admin',
  ADMIN_EMPRESA: '/admin-empresa',
  GERENTE: '/gerente',
  CAJERO: '/cajero',
  INVENTARIO: '/inventario',
  FARMACEUTICO: '/farmaceutico',
  CONTADOR: '/contador',
} as const

export const roleRoutesById: Record<number, string> = {
  1: ROLE_PATHS.SUPER_ADMIN,
  2: ROLE_PATHS.ADMIN_EMPRESA,
  3: ROLE_PATHS.GERENTE,
  4: ROLE_PATHS.CAJERO,
  5: ROLE_PATHS.INVENTARIO,
  6: ROLE_PATHS.FARMACEUTICO,
  7: ROLE_PATHS.CONTADOR,
}

export function getRoleRoute(rolId: number) {
  return roleRoutesById[rolId] ?? '/login'
}
