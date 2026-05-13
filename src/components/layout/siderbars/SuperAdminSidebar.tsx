import type { ReactNode } from 'react'

type SidebarItem = {
  label: string
  icon: ReactNode
}

const items: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10a1 1 0 001 1h4V14h4v7h4a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    label: 'Ventas',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10l-1 10H8L7 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5a3 3 0 013-3h0a3 3 0 013 3v2" />
      </svg>
    ),
  },
  {
    label: 'POS',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h6" />
      </svg>
    ),
  },
  {
    label: 'Productos/Servicios',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: 'Rotulos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12v18H6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6" />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
      </svg>
    ),
  },
  {
    label: 'Compras',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="18" cy="19" r="1" />
      </svg>
    ),
  },
  {
    label: 'Inventario',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v10H4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5h8v2" />
      </svg>
    ),
  },
  {
    label: 'Usuarios/Locales y Series',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20a6 6 0 0112 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 20a4 4 0 018 0" />
      </svg>
    ),
  },
  {
    label: 'Guias de remision',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h12l4 4v10H4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
      </svg>
    ),
  },
  {
    label: 'Comprobantes avanzados',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    label: 'Reportes',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 17V9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 17v-7" />
      </svg>
    ),
  },
  {
    label: 'Contabilidad',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 6h14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 18h8" />
      </svg>
    ),
  },
  {
    label: 'Finanzas',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h6a3 3 0 010 6h-4a3 3 0 000 6h6" />
      </svg>
    ),
  },
  {
    label: 'Configuracion',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0" />
      </svg>
    ),
  },
]

export function SuperAdminSidebar() {
  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-slate-800/50 bg-slate-900 text-slate-100">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-500/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Farmacia
          </div>
          <span className="text-lg font-semibold tracking-wide">SaaS</span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-semibold shadow-lg shadow-emerald-600/30">
          Dashboard
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-6">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                <span className="text-slate-300">{item.icon}</span>
                <span>{item.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="ml-auto h-4 w-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-800/50 px-6 py-4 text-xs text-slate-400">
        Version 0.1.0
      </div>
    </aside>
  )
}
