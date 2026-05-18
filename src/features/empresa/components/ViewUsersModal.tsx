type Usuario = {
  id: number
  nombres: string
  apellidos: string
  correo: string
  telefono?: string | null
  rol_id?: number
  rol_nombre?: string | null
  estado?: boolean
}

type Props = {
  isOpen: boolean
  empresaNombre?: string
  usuarios: Usuario[]
  onClose: () => void
}

import { CloseIcon } from '../../../components/icons'

export default function ViewUsersModal({
  isOpen,
  empresaNombre,
  usuarios,
  onClose,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-xl font-medium text-slate-800">
              Usuarios de la empresa
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {empresaNombre || 'Empresa no seleccionada'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {usuarios.length === 0 ? (
          <div className="mx-6 rounded-sm border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              No hay usuarios registrados
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Esta empresa todavía no tiene usuarios asignados
            </p>
          </div>
        ) : (
          <div className="mx-6 overflow-hidden rounded-sm border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Usuario</th>
                  <th className="px-4 py-3 font-semibold">Correo</th>
                  <th className="px-4 py-3 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 font-semibold">Rol</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-800">
                      {usuario.nombres} {usuario.apellidos}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {usuario.correo}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {usuario.telefono || 'No registrado'}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {usuario.rol_nombre || 'Sin rol'}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          usuario.estado
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {usuario.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end px-6 pb-6">

        </div>
      </div>
    </div>
  )
}