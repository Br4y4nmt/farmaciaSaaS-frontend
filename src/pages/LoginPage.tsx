import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/components/LoginForm'
import type { AuthUser } from '../features/auth/types/auth.types'
import { getStoredUser, setStoredUser } from '../features/auth/utils/authStorage'
import { getRoleRoute } from '../features/auth/utils/roleRoutes'

export function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = getStoredUser()
    if (user) {
      navigate(getRoleRoute(user.rol_id), { replace: true })
    }
  }, [navigate])

  function handleLoginSuccess(nextUser: AuthUser) {
    setStoredUser(nextUser)
    navigate(getRoleRoute(nextUser.rol_id), { replace: true })
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Image side — ~60% of screen */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <img
          src="/images/login.png"
          alt="Ilustracion de compras y ventas"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Form side — ~40% of screen */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-8 py-10 relative">

        {/* Logo esquina superior derecha del panel */}
        <div className="absolute top-6 right-8">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-30 w-auto object-contain"
          />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-medium uppercase tracking-wide text-slate-600">
              Bienvenido a<br />Corporación BRYAN E.I.R.L
            </h1>
            <p className="mt-4 text-sm text-slate-500">Ingresa a tu cuenta</p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}