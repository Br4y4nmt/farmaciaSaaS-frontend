import { useEffect, useState } from 'react'
import { rolService } from '../api/rolService'
import type { Permiso, RolConPermisos } from '../types/rol.types'

export function usePermisosByRol(rolId: string) {
  const [rol, setRol] = useState<RolConPermisos | null>(null)
  const [permisos, setPermisos] = useState<Permiso[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchPermisos() {
    if (!rolId) {
      setRol(null)
      setPermisos([])
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await rolService.getPermisosByRol(Number(rolId))

      setRol(data)
      setPermisos(data.permisos || [])
    } catch (error) {
      console.error(error)
      setRol(null)
      setPermisos([])
      setError('No se pudieron cargar los permisos del rol')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPermisos()
  }, [rolId])

  return {
    rol,
    permisos,
    isLoading,
    error,
    refetch: fetchPermisos,
  }
}