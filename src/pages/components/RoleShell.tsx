import type { AuthUser } from '../../features/auth/types/auth.types'

type RoleShellProps = {
  title: string
  subtitle: string
  user: AuthUser | null
}

export function RoleShell({ title, subtitle, user }: RoleShellProps) {
  return (
    <div className="w-full max-w-4xl rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <h2 className="text-sm font-semibold text-emerald-700">Usuario autenticado</h2>
          {user ? (
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <div>
                <span className="font-medium">ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium">Correo:</span> {user.correo ?? 'Sin correo'}
              </div>
              <div>
                <span className="font-medium">Rol ID:</span> {user.rol_id}
              </div>
              <div>
                <span className="font-medium">Empresa ID:</span> {user.empresa_id}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No se encontro usuario en sesion.</p>
          )}
        </div>
    </div>
  )
}
