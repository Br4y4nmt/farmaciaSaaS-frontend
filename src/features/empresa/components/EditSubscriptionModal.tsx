import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Empresa } from '../types/empresa.types'
import { CloseIcon } from '../../../components/icons'
import { usePlanes } from '../../planes/hooks/usePlanes'

type EditSubscriptionModalProps = {
  open: boolean
  empresa: Empresa | null
  onClose: () => void
  onSubmit: (data: {
    empresa_id: number
    plan_id: number | null
    fecha_inicio: string
    fecha_vencimiento: string
  }) => void | Promise<void>
  isSubmitting?: boolean
}

export function EditSubscriptionModal({
  open,
  empresa,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditSubscriptionModalProps) {
  const { planes, isLoading: isLoadingPlanes, error: planesError } = usePlanes()
  const [planId, setPlanId] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')

  useEffect(() => {
    if (!empresa) return

    setPlanId(empresa.plan_id ? String(empresa.plan_id) : '')
    setFechaInicio(empresa.fecha_inicio || '')
    setFechaVencimiento(empresa.fecha_vencimiento || '')
  }, [empresa])

  if (!open || !empresa) return null

  const currentEmpresa = empresa

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit({
      empresa_id: currentEmpresa.id,
      plan_id: planId ? Number(planId) : null,
      fecha_inicio: fechaInicio,
      fecha_vencimiento: fechaVencimiento,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-medium text-slate-800">
              Editar suscripción
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Empresa: {currentEmpresa.nombre}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#606266]">
              Tipo de suscripción
            </label>

            <select
              value={planId}
              onChange={(event) => setPlanId(event.target.value)}
              disabled={isLoadingPlanes}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="">
                {isLoadingPlanes ? 'Cargando planes...' : 'Sin plan'}
              </option>

              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#606266]">
              Fecha de inicio
            </label>

            <input
              type="date"
              value={fechaInicio}
              onChange={(event) => setFechaInicio(event.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#606266]">
              Fecha de vencimiento
            </label>

            <input
              type="date"
              value={fechaVencimiento}
              onChange={(event) => setFechaVencimiento(event.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {planesError && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {planesError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}