import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  DashboardIcon,
  ShoppingBagIcon,
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
    path: '/admin-empresa',
  },
  {
    label: 'POS',
    icon: <CompraIcon />,
    submenu: [
      { label: 'Punto de Venta', path: '/admin-empresa/pos' },
      { label: 'Venta Rápida', path: '/admin-empresa/pos/venta-rapida' },
      { label: 'Buscar Producto', path: '/admin-empresa/pos/buscar-producto' },
      { label: 'Caja POS', path: '/admin-empresa/pos/caja' },
      { label: 'Apertura de Turno', path: '/admin-empresa/pos/apertura-turno' },
      { label: 'Cierre de Turno', path: '/admin-empresa/pos/cierre-turno' },
    ],
  },
  {
    label: 'Productos',
    icon: <ProductsIcon />,
    submenu: [
      { label: 'Productos', path: '/admin-empresa/productos' },
      { label: 'Categorías', path: '/admin-empresa/productos/categorias' },
      { label: 'Laboratorios', path: '/admin-empresa/productos/laboratorios' },
      { label: 'Marcas', path: '/admin-empresa/productos/marcas' },
      { label: 'Presentaciones', path: '/admin-empresa/productos/presentaciones' },
      { label: 'Unidades de Medida', path: '/admin-empresa/productos/unidades-medida' },
      { label: 'Principios Activos', path: '/admin-empresa/productos/principios-activos' },
      { label: 'Códigos de Barras', path: '/admin-empresa/productos/codigos-barras' },
      { label: 'Packs / Promociones', path: '/admin-empresa/productos/promociones' },
    ],
  },
  {
    label: 'Inventario',
    icon: <InventoryIcon />,
    submenu: [
      { label: 'Stock General', path: '/admin-empresa/inventario/stock' },
      { label: 'Stock por Sucursal', path: '/admin-empresa/inventario/stock-sucursal' },
      { label: 'Lotes', path: '/admin-empresa/inventario/lotes' },
      { label: 'Kardex', path: '/admin-empresa/inventario/kardex' },
      { label: 'Movimientos', path: '/admin-empresa/inventario/movimientos' },
      { label: 'Ajustes de Inventario', path: '/admin-empresa/inventario/ajustes' },
      { label: 'Traslados entre Sucursales', path: '/admin-empresa/inventario/traslados' },
      { label: 'Productos por Vencer', path: '/admin-empresa/inventario/productos-por-vencer' },
      { label: 'Stock Crítico', path: '/admin-empresa/inventario/stock-critico' },
    ],
  },
  {
    label: 'Compras',
    icon: <ShoppingBagIcon />,
    submenu: [
      { label: 'Compras', path: '/admin-empresa/compras' },
      { label: 'Órdenes de Compra', path: '/admin-empresa/compras/ordenes' },
      { label: 'Recepción de Mercadería', path: '/admin-empresa/compras/recepcion' },
      { label: 'Guías de Entrada', path: '/admin-empresa/compras/guias-entrada' },
      { label: 'Devolución a Proveedor', path: '/admin-empresa/compras/devoluciones' },
      { label: 'Gastos', path: '/admin-empresa/compras/gastos' },
    ],
  },
  {
    label: 'Proveedores',
    icon: <ProveedorIcon />,
    submenu: [
      { label: 'Lista de Proveedores', path: '/admin-empresa/proveedores' },
      { label: 'Cuentas por Pagar', path: '/admin-empresa/proveedores/cuentas-pagar' },
      { label: 'Historial de Compras', path: '/admin-empresa/proveedores/historial-compras' },
    ],
  },
  {
    label: 'Ventas',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Comprobante Electrónico', path: '/admin-empresa/ventas/comprobante-electronico' },
      { label: 'Listado de Comprobantes', path: '/admin-empresa/ventas/comprobantes' },
      { label: 'Boletas y Facturas', path: '/admin-empresa/ventas/boletas-facturas' },
      { label: 'Notas de Venta', path: '/admin-empresa/ventas/notas-venta' },
      { label: 'Pedidos', path: '/admin-empresa/ventas/pedidos' },
      { label: 'Cotizaciones', path: '/admin-empresa/ventas/cotizaciones' },
      { label: 'Devoluciones', path: '/admin-empresa/ventas/devoluciones' },
      { label: 'Comprobantes no Enviados', path: '/admin-empresa/ventas/comprobantes-no-enviados' },
      { label: 'CPE Pendientes de Rectificación', path: '/admin-empresa/ventas/cpe-pendientes' },
      { label: 'Documentos de Contingencia', path: '/admin-empresa/ventas/contingencia' },
      { label: 'Resúmenes y Anulaciones', path: '/admin-empresa/ventas/resumenes-anulaciones' },
    ],
  },
  {
    label: 'Caja',
    icon: <CajaIcon />,
    submenu: [
      { label: 'Apertura de Caja', path: '/admin-empresa/caja/apertura' },
      { label: 'Cierre de Caja', path: '/admin-empresa/caja/cierre' },
      { label: 'Movimientos de Caja', path: '/admin-empresa/caja/movimientos' },
      { label: 'Arqueos', path: '/admin-empresa/caja/arqueos' },
      { label: 'Ingresos y Egresos', path: '/admin-empresa/caja/ingresos-egresos' },
      { label: 'Turnos de Caja', path: '/admin-empresa/caja/turnos' },
    ],
  },
  {
    label: 'Clientes',
    icon: <ClienteIcon />,
    submenu: [
      { label: 'Lista de Clientes', path: '/admin-empresa/clientes' },
      { label: 'Historial de Compras', path: '/admin-empresa/clientes/historial' },
      { label: 'Créditos', path: '/admin-empresa/clientes/creditos' },
      { label: 'Fidelización', path: '/admin-empresa/clientes/fidelizacion' },
    ],
  },
  {
    label: 'Recetas Médicas',
    icon: <RecetaIcon />,
    submenu: [
      { label: 'Validación de Recetas', path: '/admin-empresa/recetas' },
      { label: 'Historial de Recetas', path: '/admin-empresa/recetas/historial' },
      { label: 'Medicamentos Controlados', path: '/admin-empresa/recetas/medicamentos-controlados' },
    ],
  },
  {
    label: 'Reportes',
    icon: <ReportIcon />,
    submenu: [
      { label: 'Reporte de Ventas', path: '/admin-empresa/reportes/ventas' },
      { label: 'Reporte de Compras', path: '/admin-empresa/reportes/compras' },
      { label: 'Reporte de Inventario', path: '/admin-empresa/reportes/inventario' },
      { label: 'Reporte de Caja', path: '/admin-empresa/reportes/caja' },
      { label: 'Kardex Valorizado', path: '/admin-empresa/reportes/kardex-valorizado' },
      { label: 'Productos por Vencer', path: '/admin-empresa/reportes/productos-por-vencer' },
      { label: 'Productos Más Vendidos', path: '/admin-empresa/reportes/productos-mas-vendidos' },
      { label: 'Utilidades', path: '/admin-empresa/reportes/utilidades' },
    ],
  },
  {
    label: 'Seguridad',
    icon: <SecurityIcon />,
    submenu: [
      { label: 'Usuarios', path: '/admin-empresa/usuarios' },
      { label: 'Roles', path: '/admin-empresa/roles' },
      { label: 'Permisos', path: '/admin-empresa/permisos' },
      { label: 'Auditoría', path: '/admin-empresa/auditoria' },
    ],
  },
  {
    label: 'Configuración',
    icon: <SettingsIcon />,
    submenu: [
      { label: 'Datos Generales', path: '/admin-empresa/configuracion' },
      { label: 'Impuestos', path: '/admin-empresa/configuracion/impuestos' },
      { label: 'Series y Correlativos', path: '/admin-empresa/configuracion/series' },
      { label: 'Moneda', path: '/admin-empresa/configuracion/moneda' },
      { label: 'SUNAT', path: '/admin-empresa/configuracion/sunat' },
      { label: 'Backups', path: '/admin-empresa/configuracion/backups' },
    ],
  },
  {
    label: 'Soporte',
    icon: <SupportIcon />,
    submenu: [
      { label: 'Tickets', path: '/admin-empresa/soporte/tickets' },
      { label: 'Incidencias', path: '/admin-empresa/soporte/incidencias' },
      { label: 'Logs del Sistema', path: '/admin-empresa/soporte/logs' },
    ],
  },
]

type AdminEmpresaSidebarProps = {
  collapsed: boolean
}

export function AdminEmpresaSidebar({ collapsed }: AdminEmpresaSidebarProps) {
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