import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DashboardIcon,
  EmpresaIcon,
  PlanIcon,
  ReportIcon,
  SecurityIcon,
  SettingsIcon,
  SupportIcon,
  ClienteIcon,
  CajaIcon,
  InventoryIcon,
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
    label: 'Facturación SaaS',
    icon: <CajaIcon />,
    submenu: [
      { label: 'Pagos Recibidos', path: '/super-admin/facturacion/pagos' },
      { label: 'Comprobantes SaaS', path: '/super-admin/facturacion/comprobantes' },
      { label: 'Ingresos Mensuales', path: '/super-admin/facturacion/ingresos-mensuales' },
      { label: 'Ingresos Anuales', path: '/super-admin/facturacion/ingresos-anuales' },
      { label: 'Métodos de Pago', path: '/super-admin/facturacion/metodos-pago' },
    ],
  },
  {
    label: 'Usuarios Globales',
    icon: <ClienteIcon />,
    submenu: [
      { label: 'Usuarios del Sistema', path: '/super-admin/usuarios-globales' },
      { label: 'Super Administradores', path: '/super-admin/usuarios-globales/super-admins' },
      { label: 'Usuarios de Soporte', path: '/super-admin/usuarios-globales/soporte' },
      { label: 'Roles Globales', path: '/super-admin/usuarios-globales/roles' },
    ],
  },
  {
    label: 'Monitoreo',
    icon: <InventoryIcon />,
    submenu: [
      { label: 'Empresas Conectadas', path: '/super-admin/monitoreo/empresas-conectadas' },
      { label: 'Usuarios en Línea', path: '/super-admin/monitoreo/usuarios-linea' },
      { label: 'Actividad Reciente', path: '/super-admin/monitoreo/actividad-reciente' },
      { label: 'Errores del Sistema', path: '/super-admin/monitoreo/errores' },
      { label: 'Rendimiento', path: '/super-admin/monitoreo/rendimiento' },
    ],
  },
  {
    label: 'Reportes',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Empresas Activas', path: '/super-admin/reportes/empresas-activas' },
      { label: 'Empresas Vencidas', path: '/super-admin/reportes/empresas-vencidas' },
      { label: 'Nuevas Suscripciones', path: '/super-admin/reportes/nuevas-suscripciones' },
      { label: 'Ingresos SaaS', path: '/super-admin/reportes/ingresos-saas' },
      { label: 'Uso por Empresa', path: '/super-admin/reportes/uso-por-empresa' },
    ],
  },
  {
    label: 'Seguridad',
    icon: <SecurityIcon />,
    submenu: [
      { label: 'Auditoría Global', path: '/super-admin/seguridad/auditoria' },
      { label: 'Logs Globales', path: '/super-admin/seguridad/logs' },
      { label: 'Sesiones Activas', path: '/super-admin/seguridad/sesiones' },
      { label: 'Intentos Fallidos', path: '/super-admin/seguridad/intentos-fallidos' },
      { label: 'Tokens de Acceso', path: '/super-admin/seguridad/tokens' },
      { label: 'Permisos Globales', path: '/super-admin/seguridad/permisos' },
    ],
  },
  {
    label: 'Soporte',
    icon: <SupportIcon />,
    submenu: [
      { label: 'Tickets', path: '/super-admin/soporte/tickets' },
      { label: 'Incidencias', path: '/super-admin/soporte/incidencias' },
      { label: 'Chat Soporte', path: '/super-admin/soporte/chat' },
      { label: 'Estado de Tickets', path: '/super-admin/soporte/estado-tickets' },
    ],
  },
  {
    label: 'Configuración Global',
    icon: <SettingsIcon />,
    submenu: [
      { label: 'Configuración SaaS', path: '/super-admin/configuracion' },
      { label: 'Logo del Sistema', path: '/super-admin/configuracion/logo' },
      { label: 'Correos del Sistema', path: '/super-admin/configuracion/correos' },
      { label: 'SMTP', path: '/super-admin/configuracion/smtp' },
      { label: 'API Keys', path: '/super-admin/configuracion/api-keys' },
      { label: 'Integraciones', path: '/super-admin/configuracion/integraciones' },
      { label: 'Backups Globales', path: '/super-admin/configuracion/backups' },
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