import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { FarmaceuticoSidebar } from '../../components/layout/siderbars/FarmaceuticoSidebar'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { useCajaEstado } from '../../features/caja/hooks/useCajaEstado'
import { useCajaActions } from '../../features/caja/hooks/useCajaActions'
import { showSuccess } from '../../components/ui/sonner'

function toNumber(value: string | number | null | undefined) {
  const numberValue = Number(value || 0)
  return Number.isNaN(numberValue) ? 0 : numberValue
}

function formatMoney(value: string | number | null | undefined) {
  return `S/ ${toNumber(value).toFixed(2)}`
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function CajaChicaPosPage() {
  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [montoInicial, setMontoInicial] = useState('')
  const [observacionApertura, setObservacionApertura] = useState('')
  const [montoFinal, setMontoFinal] = useState('')
  const [observacionCierre, setObservacionCierre] = useState('')

  const {
    caja,
    resumen,
    tieneCajaAbierta,
    isLoading,
    error,
    refetch,
  } = useCajaEstado()

  const {
    abrirCaja,
    cerrarCaja,
    isLoading: savingCaja,
    error: actionError,
  } = useCajaActions()

  const totalVentas = toNumber(resumen?.total_ventas)
  const totalEfectivo = toNumber(resumen?.total_efectivo)
  const totalDigital = Math.max(totalVentas - totalEfectivo, 0)
  const resumenPagos = resumen?.resumen_pagos || []

  const montoEsperado = useMemo(() => {
    if (!caja) return 0

    if (resumen?.monto_esperado_actual !== undefined) {
      return toNumber(resumen.monto_esperado_actual)
    }

    return (
      toNumber(caja.monto_inicial) +
      totalEfectivo +
      toNumber(caja.total_ingresos) -
      toNumber(caja.total_egresos)
    )
  }, [caja, resumen?.monto_esperado_actual, totalEfectivo])

  const diferenciaCierre = useMemo(() => {
    if (!montoFinal) return 0

    return toNumber(montoFinal) - montoEsperado
  }, [montoFinal, montoEsperado])

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  async function handleAbrirCaja(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const monto = Number(montoInicial || 0)

    if (Number.isNaN(monto) || monto < 0) {
      alert('El monto inicial no es válido.')
      return
    }

    const response = await abrirCaja({
      monto_inicial: monto,
      observacion_apertura: observacionApertura.trim() || null,
    })

    if (!response) return

    showSuccess('Caja aperturada correctamente')

    setMontoInicial('')
    setObservacionApertura('')
    refetch()
  }

  async function handleCerrarCaja(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const monto = Number(montoFinal)

    if (Number.isNaN(monto) || monto < 0) {
      alert('El monto contado no es válido.')
      return
    }

    const response = await cerrarCaja({
      monto_final: monto,
      observacion_cierre: observacionCierre.trim() || null,
    })

    if (!response) return

    showSuccess('Caja cerrada correctamente')

    setMontoFinal('')
    setObservacionCierre('')
    refetch()
  }

  return (
    <div className="flex min-h-screen bg-[#f3f6fb]">
      <FarmaceuticoSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 px-6 py-6">
          <div className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Módulo de caja
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Caja chica POS
                    </h1>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Resumen operativo y cierre de caja de tu turno.
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  tieneCajaAbierta
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    tieneCajaAbierta ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {tieneCajaAbierta ? 'Caja abierta' : 'Caja cerrada'}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-md border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-full bg-slate-200" />
              <p className="text-sm font-medium text-slate-500">
                Consultando estado de caja...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center text-sm font-medium text-red-600 shadow-sm">
              {error}
            </div>
          ) : !tieneCajaAbierta ? (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <form
                onSubmit={handleAbrirCaja}
                className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
              >
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                        Apertura de caja
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">
                        Iniciar caja POS
                      </h2>
                      <p className="mt-2 max-w-none text-sm leading-6 text-slate-300">
                        Registra el efectivo inicial para comenzar tus
                        operaciones de venta.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Monto inicial
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        S/
                      </span>

                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={montoInicial}
                        onChange={(e) => setMontoInicial(e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Observación de apertura
                    </label>

                    <textarea
                      value={observacionApertura}
                      onChange={(e) => setObservacionApertura(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="Ejemplo: Inicio de turno mañana"
                    />
                  </div>

                  {actionError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {actionError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingCaja}
                    className="flex h-12 w-full items-center justify-center rounded-md bg-sky-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingCaja ? 'APERTURANDO CAJA...' : 'APERTURAR CAJA'}
                  </button>
                </div>
              </form>

              <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Guía operativa
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      Flujo recomendado
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Antes de registrar ventas, el usuario debe aperturar una
                      caja activa.
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    POS
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="group rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">
                        1
                      </span>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Apertura de caja
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Ingresa el monto inicial disponible para operar
                          ventas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">
                        2
                      </span>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Ventas asociadas
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Cada venta rápida se vinculará automáticamente a tu
                          caja abierta.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">
                        3
                      </span>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Cierre y arqueo
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Al finalizar, compara el efectivo contado contra el
                          monto esperado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                          Caja activa
                        </p>
                        <h2 className="mt-2 text-2xl font-bold">
                          {caja?.codigo || 'Caja POS'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                          Aperturada el {formatDate(caja?.fecha_apertura)}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/30">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        ABIERTA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-6">
                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Monto inicial
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">
                        {formatMoney(caja?.monto_inicial)}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Ventas efectivo
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">
                        {formatMoney(totalEfectivo)}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Ventas digitales
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">
                        {formatMoney(totalDigital)}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Ingresos
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">
                        {formatMoney(caja?.total_ingresos)}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Egresos
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">
                        {formatMoney(caja?.total_egresos)}
                      </p>
                    </div>

                    <div className="rounded-md border border-sky-100 bg-sky-50 p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-sky-600">
                        Total ventas
                      </p>
                      <p className="mt-2 text-xl font-black text-sky-700">
                        {formatMoney(totalVentas)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 p-6">
                    <div className="rounded-md border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="mt-2 text-2xl font-bold">
                            Monto esperado en caja
                          </p>
                        </div>

                        <p className="text-4xl font-black tracking-tight text-white">
                          {formatMoney(montoEsperado)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Resumen operativo
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        Estado de caja actual
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Actualizar
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-md bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Código
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {caja?.codigo || '-'}
                      </p>
                    </div>

                    <div className="rounded-md bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Apertura
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {formatDate(caja?.fecha_apertura)}
                      </p>
                    </div>

                    <div className="rounded-md bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Estado
                      </p>
                      <p className="mt-1 font-bold text-emerald-600">
                        {caja?.estado || 'ABIERTA'}
                      </p>
                    </div>
                  </div>
                </div>

                {resumenPagos.length > 0 && (
                  <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Métodos de pago
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          Resumen de cobros
                        </h3>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {resumenPagos.length} método(s)
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {resumenPagos.map((item) => (
                        <div
                          key={item.metodo_pago_id}
                          className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {item.nombre}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.codigo} · {item.tipo}
                            </p>
                          </div>

                          <p className="text-sm font-black text-slate-900">
                            {formatMoney(item.total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleCerrarCaja}
                className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 px-6 py-5">
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    Cierre de caja
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Ingresa el monto contado para calcular la diferencia del
                    cierre.
                  </p>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Monto contado
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        S/
                      </span>

                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={montoFinal}
                        onChange={(e) => setMontoFinal(e.target.value)}
                        required
                        className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
                    <div className="grid grid-cols-[1fr_auto] gap-y-3 text-sm">
                      <span className="text-slate-500">Monto esperado</span>
                      <span className="font-bold text-slate-900">
                        {formatMoney(montoEsperado)}
                      </span>

                      <span className="text-slate-500">Monto contado</span>
                      <span className="font-bold text-slate-900">
                        {formatMoney(montoFinal || 0)}
                      </span>

                      <span className="border-t border-slate-200 pt-3 font-bold text-slate-900">
                        Diferencia
                      </span>
                      <span
                        className={`border-t border-slate-200 pt-3 text-lg font-black ${
                          diferenciaCierre < 0
                            ? 'text-rose-600'
                            : diferenciaCierre > 0
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                        }`}
                      >
                        {formatMoney(diferenciaCierre)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Observación de cierre
                    </label>

                    <textarea
                      value={observacionCierre}
                      onChange={(e) => setObservacionCierre(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      placeholder="Ejemplo: Cierre normal sin diferencias"
                    />
                  </div>

                  {actionError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {actionError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingCaja}
                    className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingCaja ? 'CERRANDO CAJA...' : 'CERRAR CAJA'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}