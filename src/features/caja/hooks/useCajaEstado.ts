import { useEffect, useState } from 'react'
import { cajaService } from '../api/cajaService'
import type { Caja, ResumenCaja } from '../types/caja.types'

export function useCajaEstado() {
  const [caja, setCaja] = useState<Caja | null>(null)
  const [resumen, setResumen] = useState<ResumenCaja | null>(null)
  const [tieneCajaAbierta, setTieneCajaAbierta] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchEstado() {
    try {
      setIsLoading(true)
      setError(null)

      const data = await cajaService.getEstado()

      setCaja(data.caja)
      setResumen(data.resumen)
      setTieneCajaAbierta(data.tieneCajaAbierta)
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo consultar la caja'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEstado()
  }, [])

  return {
    caja,
    resumen,
    tieneCajaAbierta,
    isLoading,
    error,
    refetch: fetchEstado,
  }
}