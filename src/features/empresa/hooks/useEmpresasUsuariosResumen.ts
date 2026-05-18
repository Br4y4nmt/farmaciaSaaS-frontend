import { useEffect, useState } from 'react'
import { usuarioService } from '../api/usuarioService'
import type { EmpresaUsuariosResumen } from '../types/empresa.types'

export function useEmpresasUsuariosResumen() {
  const [empresas, setEmpresas] = useState<
    EmpresaUsuariosResumen[]
  >([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  async function fetchEmpresas() {
    setIsLoading(true)
    setError(null)

    try {
      const response =
        await usuarioService.getEmpresasUsuariosResumen()

      setEmpresas(response.empresas)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Error al obtener empresas con usuarios'

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmpresas()
  }, [])

  return {
    empresas,
    isLoading,
    error,
    refetch: fetchEmpresas,
  }
}