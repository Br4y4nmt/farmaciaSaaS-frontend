import { api } from '../../../services/api'
import type {
  GetPlanesResponse,
  CreatePlanDto,
  UpdatePlanDto,
} from '../types/plan.types'

export const planService = {
  async getAll(): Promise<GetPlanesResponse> {
    const { data } = await api.get('/planes')
    return data.data
  },

  async create(payload: CreatePlanDto) {
    const { data } = await api.post(
      '/planes',
      payload
    )

    return data.data
  },

  async update(id: number, payload: UpdatePlanDto) {
    const { data } = await api.put(
      `/planes/${id}`,
      payload
    )

    return data.data
  },

}