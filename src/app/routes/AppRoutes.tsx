import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../../pages/LoginPage'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { AdminEmpresaPage } from '../../pages/admin-empresa/AdminEmpresaPage'
import { CajeroPage } from '../../pages/cajero/CajeroPage'
import { ContadorPage } from '../../pages/contador/ContadorPage'
import { FarmaceuticoPage } from '../../pages/farmaceutico/FarmaceuticoPage'
import { GerentePage } from '../../pages/gerente/GerentePage'
import { InventarioPage } from '../../pages/inventario/InventarioPage'
import { SuperAdminPage } from '../../pages/super-admin/SuperAdminPage'
import { ROLE_PATHS } from '../../features/auth/utils/roleRoutes'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={[1]} />}>
        <Route path={ROLE_PATHS.SUPER_ADMIN} element={<SuperAdminPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[2]} />}>
        <Route path={ROLE_PATHS.ADMIN_EMPRESA} element={<AdminEmpresaPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[3]} />}>
        <Route path={ROLE_PATHS.GERENTE} element={<GerentePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[4]} />}>
        <Route path={ROLE_PATHS.CAJERO} element={<CajeroPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[5]} />}>
        <Route path={ROLE_PATHS.INVENTARIO} element={<InventarioPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[6]} />}>
        <Route path={ROLE_PATHS.FARMACEUTICO} element={<FarmaceuticoPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[7]} />}>
        <Route path={ROLE_PATHS.CONTADOR} element={<ContadorPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
