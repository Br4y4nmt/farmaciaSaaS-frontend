import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DashboardIcon,
  EmpresaIcon,
  PlanIcon,
  VentasIcon,
  InventoryIcon,
  CompraIcon,
  ClienteIcon,
  ProveedorIcon,
  CajaIcon,
  RecetaIcon,
  ReportIcon,
  SecurityIcon,
  SettingsIcon,
  SupportIcon,
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
    path: '/super-admin',
  },
  {
    label: 'Empresa',
    icon: <EmpresaIcon />,
    submenu: [
      { label: 'Lista de Empresas', path: '/super-admin/empresa' },
      { label: 'Usuarios por Empresa', path: '/super-admin/empresa/usuarios' },
      { label: 'Sucursales', path: '/super-admin/empresa/sucursales' },
      { label: 'Estadísticas', path: '/super-admin/empresa/estadisticas' },
    ],
  },
  {
    label: 'Planes',
    icon: <PlanIcon />,
    submenu: [
      { label: 'Lista de Planes', path: '/super-admin/planes' },
      { label: 'Suscripciones', path: '/super-admin/empresa/suscripciones' },
      { label: 'Vencimientos', path: '/super-admin/empresa/vencimientos' },
    ],
  },
  {
    label: 'Ventas',
    icon: <VentasIcon />,
    submenu: [
      { label: 'POS / Caja', path: '/super-admin/ventas/pos' },
      { label: 'Historial', path: '/super-admin/ventas' },
      { label: 'Cotizaciones', path: '/super-admin/cotizaciones' },
      { label: 'Devoluciones', path: '/super-admin/devoluciones' },
      { label: 'Métodos de Pago', path: '/super-admin/metodos-pago' },
    ],
  },
  {
    label: 'Inventario',
    icon: <InventoryIcon />,
    submenu: [
      { label: 'Productos', path: '/super-admin/productos' },
      { label: 'Categorías', path: '/super-admin/categorias' },
      { label: 'Laboratorios', path: '/super-admin/laboratorios' },
      { label: 'Lotes', path: '/super-admin/lotes' },
      { label: 'Stock General', path: '/super-admin/stock' },
      { label: 'Stock por Sucursal', path: '/super-admin/stock-sucursal' },
      { label: 'Kardex', path: '/super-admin/kardex' },
      { label: 'Ajustes Inventario', path: '/super-admin/ajustes' },
      { label: 'Productos por Vencer', path: '/super-admin/vencimientos-productos' },
    ],
  },
  {
    label: 'Compras',
    icon: <CompraIcon />,
    submenu: [
      { label: 'Compras', path: '/super-admin/compras' },
      { label: 'Órdenes de Compra', path: '/super-admin/ordenes-compra' },
      { label: 'Recepción', path: '/super-admin/recepcion' },
      { label: 'Gastos', path: '/super-admin/gastos' },
    ],
  },
  {
    label: 'Clientes',
    icon: <ClienteIcon />,
    submenu: [
      { label: 'Lista de Clientes', path: '/super-admin/clientes' },
      { label: 'Historial', path: '/super-admin/clientes/historial' },
      { label: 'Créditos', path: '/super-admin/clientes/creditos' },
      { label: 'Fidelización', path: '/super-admin/clientes/fidelizacion' },
    ],
  },
  {
    label: 'Proveedores',
    icon: <ProveedorIcon />,
    submenu: [
      { label: 'Lista de Proveedores', path: '/super-admin/proveedores' },
      { label: 'Cuentas por pagar', path: '/super-admin/cuentas-pagar' },
    ],
  },
  {
    label: 'Caja',
    icon: <CajaIcon />,
    submenu: [
      { label: 'Apertura', path: '/super-admin/caja/apertura' },
      { label: 'Cierre', path: '/super-admin/caja/cierre' },
      { label: 'Movimientos', path: '/super-admin/caja/movimientos' },
      { label: 'Arqueos', path: '/super-admin/caja/arqueos' },
    ],
  },
  {
    label: 'Recetas Médicas',
    icon: <RecetaIcon />,
    submenu: [
      { label: 'Validación', path: '/super-admin/recetas' },
      { label: 'Historial', path: '/super-admin/recetas/historial' },
      { label: 'Medicamentos Controlados', path: '/super-admin/medicamentos-controlados' },
    ],
  },
  {
    label: 'Reportes',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Ventas', path: '/super-admin/reportes/ventas' },
      { label: 'Compras', path: '/super-admin/reportes/compras' },
      { label: 'Utilidades', path: '/super-admin/reportes/utilidades' },
      { label: 'Más vendidos', path: '/super-admin/reportes/mas-vendidos' },
      { label: 'Inventario', path: '/super-admin/reportes/inventario' },
      { label: 'Vencimientos', path: '/super-admin/reportes/vencimientos' },
      { label: 'Caja', path: '/super-admin/reportes/caja' },
    ],
  },
  {
    label: 'Seguridad',
    icon: <SecurityIcon />,
    submenu: [
      { label: 'Usuarios', path: '/super-admin/usuarios' },
      { label: 'Roles', path: '/super-admin/roles' },
      { label: 'Permisos', path: '/super-admin/permisos' },
      { label: 'Auditoría', path: '/super-admin/auditoria' },
    ],
  },
  {
    label: 'Configuración',
    icon: <SettingsIcon />,
    submenu: [
      { label: 'Datos Empresa', path: '/super-admin/configuracion' },
      { label: 'Impuestos', path: '/super-admin/impuestos' },
      { label: 'Series', path: '/super-admin/series' },
      { label: 'Moneda', path: '/super-admin/moneda' },
      { label: 'SUNAT', path: '/super-admin/sunat' },
      { label: 'Backups', path: '/super-admin/backups' },
    ],
  },
  {
    label: 'Soporte',
    icon: <SupportIcon />,
    submenu: [
      { label: 'Tickets', path: '/super-admin/tickets' },
      { label: 'Incidencias', path: '/super-admin/incidencias' },
      { label: 'Logs', path: '/super-admin/logs' },
    ],
  },
]

type SuperAdminSidebarProps = {
  collapsed: boolean
}

export function SuperAdminSidebar({ collapsed }: SuperAdminSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const match = items.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname),
    )
    return match?.label ?? null
  })

  const menuItems = useMemo(() => items, [])

  useEffect(() => {
    const match = items.find((item) =>
      item.submenu?.some((sub) => sub.path === location.pathname),
    )
    setOpenMenu(match?.label ?? null)
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
                            onClick={() => navigate(sub.path)}
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

      <div className="sidebar-footer">Version 0.0.1</div>
    </aside>
  )
}