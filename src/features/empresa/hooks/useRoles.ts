import { useEffect, useState } from 'react'

import { roleService } from '../api/roleService'
import type { Role } from '../types/role.types'

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function fetchRoles() {
    try {
      setIsLoading(true)

      const response =
        await roleService.getAll()

      setRoles(response)

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Error al obtener roles'
      )
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