export type Proveedor = {
  id: number
  empresa_id: number

  tipo_documento: 'RUC' | 'DNI' | 'CE' | 'PASAPORTE' | 'OTRO'
  numero_documento: string

  razon_social: string
  nombre_comercial?: string | null

  direccion?: string | null
  departamento?: string | null
  provincia?: string | null
  distrito?: string | null

  telefono?: string | null
  celular?: string | null
  correo?: string | null

  contacto_nombre?: string | null
  contacto_telefono?: string | null
  contacto_correo?: string | null

  observacion?: string | null
  estado: boolean

  created_at?: string
  updated_at?: string | null
}

export type ProveedorResponse = {
  ok: boolean
  data: {
    proveedores: Proveedor[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

export type CreateProveedorPayload = {
  empresa_id: number
  tipo_documento: string
  numero_documento: string
  razon_social: string
  nombre_comercial?: string
  direccion?: string
  departamento?: string
  provincia?: string
  distrito?: string
  telefono?: string
  celular?: string
  correo?: string
  contacto_nombre?: string
  contacto_telefono?: string
  contacto_correo?: string
  observacion?: string
  estado?: boolean
}