import type { AuthUser } from '../../../features/auth/types/auth.types'

type QuickAction = {
  label: string
}

type SuperAdminHeaderProps = {
  user: AuthUser | null
  onLogout?: () => void
}

const quickActions: QuickAction[] = [
  { label: 'NC' },
  { label: 'POS' },
  { label: 'ME' },
  { label: 'USR' },
]

export function SuperAdminHeader({ user, onLogout }: SuperAdminHeaderProps) {
  const displayName = user?.nombres
    ? `${user.nombres} ${user.apellidos ?? ''}`.trim()
    : 'Usuario'
  const displayEmail = user?.correo ?? 'correo@empresa.com'

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                {action.label}
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-600">PROD</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="Carrito"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="18" cy="19" r="1" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white">
              0
            </span>
          </button>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="Notificaciones"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a3 3 0 006 0" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              10
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-1.5">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-700">{displayName}</p>
              <p className="text-[11px] text-slate-400">{displayEmail}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="8" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
              </svg>
            </div>
          </div>

          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Salir
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
