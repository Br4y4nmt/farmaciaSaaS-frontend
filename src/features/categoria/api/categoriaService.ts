import { api } from '../../../services/api'
import type {
  CreateCategoriaDto,
  GetCategoriasResponse,
  GetCategoriasRaizResponse,
  UpdateCategoriaDto,
} from '../types/categoria.types'

export const categoriaService = {
  async create(payload: CreateCategoriaDto) {
    const { data } = await api.post('/categorias', payload)
    return data.data
  },

  async getRaiz(empresaId: number): Promise<GetCategoriasRaizResponse> {
    const { data } = await api.get('/categorias/raiz', {
      params: {
        empresa_id: empresaId,
        limit: 100,
      },
    })

    return data.data
  },

  async getAll(empresaId: number): Promise<GetCategoriasResponse> {
    const { data } = await api.get('/categorias', {
      params: {
        empresa_id: empresaId,
        limit: 100,
      },
    })

    return data.data
  },

  async delete(id: number) {
    const { data } = await api.delete(`/categorias/${id}`)
    return data
  },

  async update(id: number, payload: UpdateCategoriaDto) {
    const { data } = await api.put(`/categorias/${id}`, payload)
    return data.data ?? data
  },
}
