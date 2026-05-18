import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { useEmpresas } from '../../features/empresa/hooks/useEmpresas'
import { useUpdateSubscription } from '../../features/empresa/hooks/useUpdateSubscription'

import type { Empresa } from '../../features/empresa/types/empresa.types'
import { EditSubscriptionModal } from '../../features/empresa/components/EditSubscriptionModal'
import { ReportIcon } from '../../components/icons'

function SubscriptionsPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { empresas, isLoading, error } = useEmpresas()
  const { updateSubscription, isLoading: isUpdatingSubscription } = useUpdateSubscription()

  const empresasActivas = empresas.filter((empresa) => empresa.estado === true)

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleEdit(empresa: Empresa) {
    setSelectedEmpresa(empresa)
    setIsEditModalOpen(true)
  }

  async function handleUpdateSubscription(data: {
    empresa_id: number
    plan_id: number | null
    fecha_inicio: string
    fecha_vencimiento: string
  }) {
    try {
      await updateSubscription(data)
      setIsEditModalOpen(false)
      setSelectedEmpresa(null)
      window.location.reload()
    } catch (error) {
      console.error('Error actualizando suscripción:', error)
    }
  }

  const columns: DataTableColumn<Empresa>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'nombre',
      header: 'Empresa',
    },
    {
      key: 'ruc',
      header: 'RUC',
      render: (empresa) => empresa.ruc || '-',
    },
    {
      key: 'plan_id',
      header: 'Tipo de suscripción',
      render: (empresa) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {empresa.plan?.nombre ?? 'Sin plan'}
        </span>
      ),
    },
    {
      key: 'fecha_inicio',
      header: 'Fecha inicio',
      render: (empresa) => empresa.fecha_inicio || '-',
    },
    {
      key: 'fecha_vencimiento',
      header: 'Fecha vencimiento',
      render: (empresa) => empresa.fecha_vencimiento || '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: () => (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Activo
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (empresa) => (
        <button
          onClick={() => handleEdit(empresa)}
          className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
        >
          Editar
        </button>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SuperAdminSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SuperAdminHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Suscripciones"
          icon={<ReportIcon />}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Suscripciones de empresas"
            columns={columns}
            data={empresasActivas}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando suscripciones..."
            emptyMessage="No existen empresas activas"
          />
        </main>
      </div>

      <EditSubscriptionModal
        open={isEditModalOpen}
        empresa={selectedEmpresa}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedEmpresa(null)
        }}
        onSubmit={handleUpdateSubscription}
        isSubmitting={isUpdatingSubscription}
      />
    </div>
  )
}

export default SubscriptionsPage