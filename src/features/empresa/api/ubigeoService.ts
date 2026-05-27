const API_URL = import.meta.env.VITE_API_URL

export type Departamento = {
  id: string
  nombre: string
}

export type Provincia = {
  id: string
  nombre: string
}

export type Distrito = {
  ubigeo: string
  nombre: string
  departamento: string
  provincia: string
  distrito: string
  inei?: string | null
}

type ApiResponse<T> = {
  ok: boolean
  data: T
  message?: string
}

export const ubigeoService = {
  async getDepartamentos(): Promise<Departamento[]> {
    const response = await fetch(`${API_URL}/ubigeo/departamentos`)

    if (!response.ok) {
      throw new Error('No se pudieron cargar los departamentos')
    }

    const data: ApiResponse<Departamento[]> = await response.json()
    return data.data
  },

  async getProvincias(departamento: string): Promise<Provincia[]> {
    const response = await fetch(
      `${API_URL}/ubigeo/provincias/${encodeURIComponent(departamento)}`,
    )

    if (!response.ok) {
      throw new Error('No se pudieron cargar las provincias')
    }

    const data: ApiResponse<Provincia[]> = await response.json()
    return data.data
  },

  async getDistritos(
    departamento: string,
    provincia: string,
  ): Promise<Distrito[]> {
    const response = await fetch(
      `${API_URL}/ubigeo/distritos/${encodeURIComponent(
        departamento,
      )}/${encodeURIComponent(provincia)}`,
    )

    if (!response.ok) {
      throw new Error('No se pudieron cargar los distritos')
    }

    const data: ApiResponse<Distrito[]> = await response.json()
    return data.data
  },
}