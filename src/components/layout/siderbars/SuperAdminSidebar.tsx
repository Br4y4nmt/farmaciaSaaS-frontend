import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DashboardIcon,
  EmpresaIcon,
  PlanIcon,
  VentasIcon,
  InventoryIcon,
  ProductsIcon,
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
    label: 'Productos',
    icon: <ProductsIcon />,
    submenu: [
      { label: 'Lista de Productos', path: '/super-admin/productos' },
      { label: 'Categorías', path: '/super-admin/productos/categorias' },
      { label: 'Laboratorios', path: '/super-admin/productos/laboratorios' },
      { label: 'Marcas', path: '/super-admin/productos/marcas' },
      { label: 'Presentaciones', path: '/super-admin/productos/presentaciones' },
      { label: 'Unidades de Medida', path: '/super-admin/productos/unidades-medida' },
      { label: 'Principios Activos', path: '/super-admin/productos/principios-activos' },
      { label: 'Códigos de Barras', path: '/super-admin/productos/codigos-barras' },
      { label: 'Packs / Promociones', path: '/super-admin/productos/promociones' },
    ],
  },
  {
    label: 'Inventario',
    icon: <InventoryIcon />,
    submenu: [
      { label: 'Stock General', path: '/super-admin/inventario/stock' },
      { label: 'Stock por Sucursal', path: '/super-admin/inventario/stock-sucursal' },
      { label: 'Lotes', path: '/super-admin/inventario/lotes' },
      { label: 'Kardex', path: '/super-admin/inventario/kardex' },
      { label: 'Movimientos', path: '/super-admin/inventario/movimientos' },
      { label: 'Ajustes de Inventario', path: '/super-admin/inventario/ajustes' },
      { label: 'Traslados entre Sucursales', path: '/super-admin/inventario/traslados' },
      { label: 'Productos por Vencer', path: '/super-admin/inventario/productos-por-vencer' },
      { label: 'Stock Crítico', path: '/super-admin/inventario/stock-critico' },
    ],
  },
  {
    label: 'Compras',
    icon: <CompraIcon />,
    submenu: [
      { label: 'Compras', path: '/super-admin/compras' },
      { label: 'Órdenes de Compra', path: '/super-admin/compras/ordenes' },
      { label: 'Recepción de Mercadería', path: '/super-admin/compras/recepcion' },
      { label: 'Guías de Entrada', path: '/super-admin/compras/guias-entrada' },
      { label: 'Devolución a Proveedor', path: '/super-admin/compras/devoluciones' },
      { label: 'Gastos', path: '/super-admin/compras/gastos' },
    ],
  },
  {
    label: 'Proveedores',
    icon: <ProveedorIcon />,
    submenu: [
      { label: 'Lista de Proveedores', path: '/super-admin/proveedores' },
      { label: 'Cuentas por Pagar', path: '/super-admin/proveedores/cuentas-pagar' },
      { label: 'Historial de Compras', path: '/super-admin/proveedores/historial-compras' },
    ],
  },
  {
    label: 'POS',
    icon: <VentasIcon />,
    submenu: [
      { label: 'Punto de Venta', path: '/super-admin/pos' },
      { label: 'Venta Rápida', path: '/super-admin/pos/venta-rapida' },
      { label: 'Buscar Producto', path: '/super-admin/pos/buscar-producto' },
      { label: 'Caja POS', path: '/super-admin/pos/caja' },
      { label: 'Apertura de Turno', path: '/super-admin/pos/apertura-turno' },
      { label: 'Cierre de Turno', path: '/super-admin/pos/cierre-turno' },
    ],
  },
  {
    label: 'Ventas',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Comprobante Electrónico', path: '/super-admin/ventas/comprobante-electronico' },
      { label: 'Listado de Comprobantes', path: '/super-admin/ventas/comprobantes' },
      { label: 'Boletas y Facturas', path: '/super-admin/ventas/boletas-facturas' },
      { label: 'Notas de Venta', path: '/super-admin/ventas/notas-venta' },
      { label: 'Pedidos', path: '/super-admin/ventas/pedidos' },
      { label: 'Cotizaciones', path: '/super-admin/ventas/cotizaciones' },
      { label: 'Devoluciones', path: '/super-admin/ventas/devoluciones' },
      { label: 'Comprobantes no Enviados', path: '/super-admin/ventas/comprobantes-no-enviados' },
      { label: 'CPE Pendientes de Rectificación', path: '/super-admin/ventas/cpe-pendientes' },
      { label: 'Documentos de Contingencia', path: '/super-admin/ventas/contingencia' },
      { label: 'Resúmenes y Anulaciones', path: '/super-admin/ventas/resumenes-anulaciones' },
    ],
  },
  {
    label: 'Caja',
    icon: <CajaIcon />,
    submenu: [
      { label: 'Apertura de Caja', path: '/super-admin/caja/apertura' },
      { label: 'Cierre de Caja', path: '/super-admin/caja/cierre' },
      { label: 'Movimientos de Caja', path: '/super-admin/caja/movimientos' },
      { label: 'Arqueos', path: '/super-admin/caja/arqueos' },
      { label: 'Ingresos y Egresos', path: '/super-admin/caja/ingresos-egresos' },
      { label: 'Turnos de Caja', path: '/super-admin/caja/turnos' },
    ],
  },
  {
    label: 'Clientes',
    icon: <ClienteIcon />,
    submenu: [
      { label: 'Lista de Clientes', path: '/super-admin/clientes' },
      { label: 'Historial de Compras', path: '/super-admin/clientes/historial' },
      { label: 'Créditos', path: '/super-admin/clientes/creditos' },
      { label: 'Fidelización', path: '/super-admin/clientes/fidelizacion' },
    ],
  },
  {
    label: 'Recetas Médicas',
    icon: <RecetaIcon />,
    submenu: [
      { label: 'Validación de Recetas', path: '/super-admin/recetas' },
      { label: 'Historial de Recetas', path: '/super-admin/recetas/historial' },
      { label: 'Medicamentos Controlados', path: '/super-admin/recetas/medicamentos-controlados' },
    ],
  },
  {
    label: 'Reportes',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Reporte de Ventas', path: '/super-admin/reportes/ventas' },
      { label: 'Reporte de Compras', path: '/super-admin/reportes/compras' },
      { label: 'Reporte de Inventario', path: '/super-admin/reportes/inventario' },
      { label: 'Reporte de Caja', path: '/super-admin/reportes/caja' },
      { label: 'Kardex Valorizado', path: '/super-admin/reportes/kardex-valorizado' },
      { label: 'Productos por Vencer', path: '/super-admin/reportes/productos-por-vencer' },
      { label: 'Productos Más Vendidos', path: '/super-admin/reportes/productos-mas-vendidos' },
      { label: 'Utilidades', path: '/super-admin/reportes/utilidades' },
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
      { label: 'Datos Generales', path: '/super-admin/configuracion' },
      { label: 'Impuestos', path: '/super-admin/configuracion/impuestos' },
      { label: 'Series y Correlativos', path: '/super-admin/configuracion/series' },
      { label: 'Moneda', path: '/super-admin/configuracion/moneda' },
      { label: 'SUNAT', path: '/super-admin/configuracion/sunat' },
      { label: 'Backups', path: '/super-admin/configuracion/backups' },
    ],
  },
  {
    label: 'Soporte',
    icon: <SupportIcon />,
    submenu: [
      { label: 'Tickets', path: '/super-admin/soporte/tickets' },
      { label: 'Incidencias', path: '/super-admin/soporte/incidencias' },
      { label: 'Logs del Sistema', path: '/super-admin/soporte/logs' },
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