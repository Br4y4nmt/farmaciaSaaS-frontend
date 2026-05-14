import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useCreateUser } from '../hooks/useCreateUser'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: Props) {
  const { createUser, isLoading, error } = useCreateUser()

  const [form, setForm] = useState({ nombre: '', correo: '', rol: 'user', empresa_id: '' })

  if (!isOpen) return null

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await createUser(form)
    if (res) {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Crear usuario</h3>
          <button onClick={onClose} className="text-sm text-slate-500">Cerrar</button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border px-2 py-1 rounded" />
          <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} className="border px-2 py-1 rounded" />
          <select name="rol" value={form.rol} onChange={handleChange} className="border px-2 py-1 rounded">
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <input name="empresa_id" placeholder="Empresa ID" value={form.empresa_id} onChange={handleChange} className="border px-2 py-1 rounded" />

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
            <button type="submit" className="px-3 py-1 rounded bg-slate-900 text-white">{isLoading ? 'Creando...' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
