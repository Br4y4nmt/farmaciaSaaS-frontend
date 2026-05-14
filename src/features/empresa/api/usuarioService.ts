import { api } from '../../../services/api'

export const usuarioService = {
  async getAll() {
    const { data } = await api.get('/usuarios')
    return data.data
  },

  async create(payload: any) {
    const { data } = await api.post('/usuarios', payload)
    return data.data
  },
}
