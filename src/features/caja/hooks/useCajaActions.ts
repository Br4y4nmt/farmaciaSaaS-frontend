import { useState } from 'react'
import { cajaService } from '../api/cajaService'
import type {
  AbrirCajaPayload,
  CerrarCajaPayload,
} from '../types/caja.types'

export function useCajaActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function abrirCaja(payload: AbrirCajaPayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await cajaService.abrir(payload)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error ? error.message : 'No se pudo aperturar caja'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  async function cerrarCaja(payload: CerrarCajaPayload) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await cajaService.cerrar(payload)

      return response
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error ? error.message : 'No se pudo cerrar caja'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    abrirCaja,
    cerrarCaja,
    isLoading,
    error,
  }
}