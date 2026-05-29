import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  DashboardIcon,
  CompraIcon,
  ProductsIcon,
  InventoryIcon,
  ClienteIcon,
  CajaIcon,
  RecetaIcon,
} from '../../icons'

type SidebarItem = {
  label: string
  icon: ReactNode
  path?: string
  submenu?: {
    label: string
    path: string
  }[]
}

const items: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/farmaceutico',
  },
  {
    label: 'POS',
    icon: <CompraIcon />,
    submenu: [
      { label: 'Punto de Venta', path: '/farmaceutico/pos' },
      { label: 'Venta Rápida', path: '/farmaceutico/pos/venta-rapida' },
      { label: 'Historial de Ventas', path: '/farmaceutico/pos/historial-ventas' },
    ],
  },
  {
    label: 'Caja',
    icon: <CajaIcon />,
    submenu: [
      { label: 'Caja chica POS', path: '/farmaceutico/caja/caja-chica' },
      { label: 'Movimientos de Caja', path: '/farmaceutico/caja/movimientos' },
      { label: 'Historial de Cajas', path: '/farmaceutico/caja/historial-cajas' },
      //{ label: 'Apertura de Turno', path: '/farmaceutico/caja/apertura-turno' },
      //{ label: 'Cierre de Turno', path: '/farmaceutico/caja/cierre-turno' },
    ],
  },
  {
    label: 'Productos',
    icon: <ProductsIcon />,
    submenu: [
      { label: 'Ver Productos', path: '/farmaceutico/productos' },
    ],
  },
  {
    label: 'Inventario',
    icon: <InventoryIcon />,
    submenu: [
      { label: 'Stock de Productos', path: '/farmaceutico/inventario/stock' },
      { label: 'Lotes', path: '/farmaceutico/inventario/lotes' },
      { label: 'Productos por Vencer', path: '/farmaceutico/inventario/productos-por-vencer' },
      { label: 'Stock Crítico', path: '/farmaceutico/inventario/stock-critico' },
    ],
  },
  {
    label: 'Clientes',
    icon: <ClienteIcon />,
    submenu: [
      { label: 'Lista de Clientes', path: '/farmaceutico/clientes' },
      { label: 'Nuevo Cliente', path: '/farmaceutico/clientes/nuevo' },
    ],
  },
  {
    label: 'Recetas Médicas',
    icon: <RecetaIcon />,
    submenu: [
      { label: 'Validación de Recetas', path: '/farmaceutico/recetas' },
      { label: 'Historial de Recetas', path: '/farmaceutico/recetas/historial' },
      { label: 'Medicamentos Controlados', path: '/farmaceutico/recetas/medicamentos-controlados' },
    ],
  },
]

type FarmaceuticoSidebarProps = {
  collapsed: boolean
  onNavigateCollapse?: () => void
}

export function FarmaceuticoSidebar({
  collapsed,
  onNavigateCollapse,
}: FarmaceuticoSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const match = items.find((item) => {
      if (item.path === location.pathname) return true

      return item.submenu?.some((sub) => sub.path === location.pathname)
    })

    return match?.submenu?.length ? match.label : null
  })

  const menuItems = useMemo(() => items, [])

  useEffect(() => {
    const match = items.find((item) => {
      if (item.path === location.pathname) return true

      return item.submenu?.some((sub) => sub.path === location.pathname)
    })

    setOpenMenu(match?.submenu?.length ? match.label : null)
  }, [location.pathname])

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
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
              ? location.pathname === item.path
              : item.submenu?.some((sub) => location.pathname === sub.path)

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
                      onNavigateCollapse?.()
                    }
                  }}
                  className={`sidebar-button ${
                    isActive && !isDashboard && (!hasSubmenu || isOpen)
                      ? 'is-active'
                      : ''
                  } ${isOpen && !isActive ? 'is-open' : ''} ${
                    isDashboard && isActive
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : ''
                  }`}
                >
                  <span className="sidebar-icon">{item.icon}</span>

                  {!collapsed && (
                    <span className="sidebar-label">{item.label}</span>
                  )}

                  {!collapsed && hasSubmenu && (
                    <span
                      className={`sidebar-chevron ${
                        isOpen ? 'is-rotated' : ''
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 6l6 6-6 6"
                        />
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
                            onClick={() => {
                              navigate(sub.path)
                              onNavigateCollapse?.()
                            }}
                            className={`sidebar-subitem ${
                              isSubActive ? 'is-active' : ''
                            }`}
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
    </aside>
  )
}

export default FarmaceuticoSidebar