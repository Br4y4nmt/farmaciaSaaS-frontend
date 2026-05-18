import { api } from '../../../services/api'
import type { Role } from '../types/role.types'

export const roleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await api.get('/roles')

    return data.data
  },
}