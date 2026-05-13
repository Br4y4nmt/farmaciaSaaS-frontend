import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-slate-500">
          La ruta que buscas no existe o no tienes acceso.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Volver al login
        </Link>
      </div>
    </div>
  )
}
