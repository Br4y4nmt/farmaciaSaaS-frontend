import { api } from '../../../services/api'
import type { GetEmpresasUsuariosResumenResponse } from '../types/empresa.types'

export const usuarioService = {
  async getAll() {
    const { data } = await api.get('/usuarios')
    return data.data
  },

  async create(payload: any) {
    const { data } = await api.post('/usuarios', payload)
    return data.data
  },

  async getEmpresasUsuariosResumen() {
    const { data } = await api.get<{
      ok: boolean
      data: GetEmpresasUsuariosResumenResponse
    }>('/empresas/usuarios-resumen')

    return data.data
  },

}