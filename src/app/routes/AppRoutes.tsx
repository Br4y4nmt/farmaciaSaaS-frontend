import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '../../pages/LoginPage'
import { NotFoundPage } from '../../pages/NotFoundPage'

import { SuperAdminPage } from '../../pages/super-admin/SuperAdminPage'
import CompanyPage from '../../pages/super-admin/CompanyPage'
import UsersPage from '../../pages/super-admin/UsersPage'
import { BranchesPage } from '../../pages/super-admin/BranchesPage'
import PlansPage from '../../pages/super-admin/PlansPage'
import SubscriptionsPage from '../../pages/super-admin/SubscriptionsPage'
import ComprasPage from '../../pages/admin-empresa/ComprasPage'
import { AdminEmpresaPage } from '../../pages/admin-empresa/AdminEmpresaPage'
import ProductsPage from '../../pages/admin-empresa/ProductsPage'
import CategoriesPage from '../../pages/admin-empresa/CategoriesPage'
import LaboratoriesPage from '../../pages/admin-empresa/LaboratoriesPage'
import BrandsPage from '../../pages/admin-empresa/BrandsPage'
import LocalesPage from '../../pages/admin-empresa/LocalesPage'
import StockGeneralPage from '../../pages/admin-empresa/StockGeneralPage'
import ProveedoresPage from '../../pages/admin-empresa/ProveedoresPage'
import { CajeroPage } from '../../pages/cajero/CajeroPage'
import { ContadorPage } from '../../pages/contador/ContadorPage'
import { FarmaceuticoPage } from '../../pages/farmaceutico/FarmaceuticoPage'
import  VentaRapidaUsuarioPage  from '../../pages/farmaceutico/VentaRapidaUsuarioPage'
import  HistorialVentasPage   from '../../pages/farmaceutico/HistorialVentasPage'
import  CajaChicaPosPage   from '../../pages/farmaceutico/CajaChicaPosPage'
import { GerentePage } from '../../pages/gerente/GerentePage'
import { InventarioPage } from '../../pages/inventario/InventarioPage'
import UsuariosPage from '../../pages/admin-empresa/UsuariosPage'
import LotesPage from '../../pages/admin-empresa/LotesPage'
import VentaRapidaPage from '../../pages/admin-empresa/VentaRapidaPage'
import StockPorSucursalPage from '../../pages/admin-empresa/StockPorSucursalPage'
import StockCriticoPage from '../../pages/admin-empresa/StockCriticoPage'
import ProductosPorVencerPage from '../../pages/admin-empresa/ProductosPorVencerPage'
import MovimientosStockPage from '../../pages/admin-empresa/MovimientosStockPage'
import { ROLE_PATHS } from '../../features/auth/utils/roleRoutes'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route
          path={ROLE_PATHS.SUPER_ADMIN}
          element={<SuperAdminPage />}
        />

        <Route
          path="/super-admin/empresa"
          element={<CompanyPage />}
        />

        <Route
          path="/super-admin/empresa/usuarios"
          element={<UsersPage />}
        />

        <Route
          path="/super-admin/empresa/sucursales"
          element={<BranchesPage />}
        />

        <Route
          path="/super-admin/empresa/suscripciones"
          element={<SubscriptionsPage />}
        />

        <Route
          path="/super-admin/planes"
          element={<PlansPage />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[2]} />}>
        <Route
          path={ROLE_PATHS.ADMIN_EMPRESA}
          element={<AdminEmpresaPage />}
        />

        <Route
          path="/admin-empresa/productos"
          element={<ProductsPage />}
        />

        <Route
          path="/admin-empresa/productos/categorias"
          element={<CategoriesPage />}
        />

        <Route
          path="/admin-empresa/productos/laboratorios"
          element={<LaboratoriesPage />}
        />

        <Route
          path="/admin-empresa/productos/marcas"
          element={<BrandsPage />}
        />

        <Route
          path="/admin-empresa/usuarios-locales/usuarios"
          element={<UsuariosPage />}
        />

        <Route
          path="/admin-empresa/usuarios-locales/locales"
          element={<LocalesPage />}
        />

        <Route
          path="/admin-empresa/stock-general"
          element={<StockGeneralPage />}
        />

        <Route
          path="/admin-empresa/proveedores"
          element={<ProveedoresPage />}
        />

        <Route
          path="/admin-empresa/compras"
          element={<ComprasPage />}
        />

        <Route
          path="/admin-empresa/pos/venta-rapida"
          element={<VentaRapidaPage />}
        />

        <Route
          path="/admin-empresa/inventario/lotes"
          element={<LotesPage />}
        />

        <Route
          path="/admin-empresa/inventario/stock-critico"
          element={<StockCriticoPage />}
        />

        <Route
          path="/admin-empresa/inventario/productos-por-vencer"
          element={<ProductosPorVencerPage />}
        />

        <Route
          path="/admin-empresa/inventario/movimientos"
          element={<MovimientosStockPage />}
        />

        <Route
          path="/admin-empresa/inventario/stock-por-sucursal"
          element={<StockPorSucursalPage />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[3]} />}>
        <Route
          path={ROLE_PATHS.GERENTE}
          element={<GerentePage />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[4]} />}>
        <Route
          path={ROLE_PATHS.CAJERO}
          element={<CajeroPage />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[5]} />}>
        <Route
          path={ROLE_PATHS.INVENTARIO}
          element={<InventarioPage />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[6]} />}>
        <Route
          path={ROLE_PATHS.FARMACEUTICO}
          element={<FarmaceuticoPage />}
        />

        <Route
          path="/farmaceutico/pos/venta-rapida"
          element={<VentaRapidaUsuarioPage />}
        />

        <Route
          path="/farmaceutico/caja/caja-chica"
          element={<CajaChicaPosPage />}
        />

        <Route
          path="/farmaceutico/pos/historial-ventas"
          element={<HistorialVentasPage />}
        />

      </Route>

      <Route element={<ProtectedRoute allowedRoles={[7]} />}>
        <Route
          path={ROLE_PATHS.CONTADOR}
          element={<ContadorPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}