import { useEffect, useState } from 'react'
import { rolService } from '../api/rolService'
import type { Rol } from '../types/rol.types'

export function useRolesAdminEmpresa() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchRoles() {
    try {
      setIsLoading(true)
      setError(null)

      const data = await rolService.getRolesAdminEmpresa()
      setRoles(data)
    } catch (error) {
      console.error(error)
      setError('No se pudieron cargar los roles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return {
    roles,
    isLoading,
    error,
    refetch: fetchRoles,
  }
}