import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type SidebarItem = {
  label: string
  icon: ReactNode
  path?: string
  submenu?: { label: string; path: string }[]
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
    path: '/super-admin',
  },

  {
    label: 'Empresa',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 5 7 13 17 13 17 5" />
      </svg>
    ),
    submenu: [
      { label: 'Lista de Empresas', path: '/super-admin/empresa' },
      { label: 'Usuarios por Empresa', path: '/super-admin/empresa/usuarios' },
    ],
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

type SuperAdminSidebarProps = {
  collapsed: boolean
}

export function SuperAdminSidebar({ collapsed }: SuperAdminSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>('Empresa')

  const menuItems = useMemo(() => items, [])

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      {/* Logo */}
<div className="flex items-center justify-center border-b border-slate-700 px-4 py-6">
  {collapsed ? (
    <img
      src="/images/logo.png"
      alt="Logo"
      className="h-12 w-12 object-contain"
    />
  ) : (
    <img
      src="/images/logo.png"
      alt="Logo"
      className="h-35 w-auto object-contain"
    />
  )}
</div>
  <nav className="sidebar-nav">
  <ul className="sidebar-list">
    {menuItems.map((item) => {
      const hasSubmenu = !!item.submenu?.length
      const isActive = item.path
        ? location.pathname === item.path  // exacto, no startsWith
        : item.submenu?.some((sub) => location.pathname === sub.path)  // también exacto
      const isOpen = openMenu === item.label
      const isDashboard = item.label === 'Dashboard'

      return (
        <li key={item.label}>
          <button
            type="button"
            onClick={() => {
              if (hasSubmenu) {
                setOpenMenu(isOpen ? null : item.label)
                return
              }
              if (item.path) {
                navigate(item.path)
              }
            }}
            className={`sidebar-button ${isActive && !isDashboard ? 'is-active' : ''} ${isOpen && !isActive ? 'is-open' : ''} ${
            isDashboard && isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
          }`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
            {!collapsed && hasSubmenu && (
              <span className={`sidebar-chevron ${isOpen ? 'is-rotated' : ''}`}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </button>

          {!collapsed && hasSubmenu && (
            <ul className={`sidebar-submenu ${isOpen ? 'is-open' : ''}`}>
              {item.submenu?.map((sub) => {
                const isSubActive = location.pathname === sub.path
                return (
                  <li key={sub.path}>
                    <button
                      type="button"
                      onClick={() => navigate(sub.path)}
                      className={`sidebar-subitem ${isSubActive ? 'is-active' : ''}`}
                    >
                      {sub.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      )
    })}
  </ul>
</nav>
      <div className="sidebar-footer">Version 0.0.1</div>
    </aside>
  )
}
