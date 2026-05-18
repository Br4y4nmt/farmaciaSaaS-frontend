import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SuperAdminHeader } from '../../components/layout/headers/SuperAdminHeader'
import { SuperAdminSidebar } from '../../components/layout/siderbars/SuperAdminSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { CreatePlanModal } from '../../features/planes/components/CreatePlanModal'
import { EditPlanModal } from '../../features/planes/components/EditPlanModal'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { usePlanes } from '../../features/planes/hooks/usePlanes'
import { useCreatePlan } from '../../features/planes/hooks/useCreatePlan'
import { useUpdatePlan } from '../../features/planes/hooks/useUpdatePlan'
import type { Plan, CreatePlanDto } from '../../features/planes/types/plan.types'
import { ReportIcon } from '../../components/icons'

function PlansPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  const { planes, isLoading, error, refetch } = usePlanes()
  const { createPlan, isLoading: isCreatingPlan } = useCreatePlan()
  const { updatePlan, isLoading: isUpdatingPlan } = useUpdatePlan()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleNew() {
    setIsCreateModalOpen(true)
  }

  async function handleCreatePlan(data: CreatePlanDto) {
    try {
      await createPlan(data)
      await refetch()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creando plan:', error)
    }
  }

  function handleEdit(plan: Plan) {
    setEditingPlan(plan)
    setIsEditModalOpen(true)
  }

  async function handleUpdatePlan(id: number, data: CreatePlanDto) {
    try {
      await updatePlan(id, data)
      await refetch()
      setIsEditModalOpen(false)
      setEditingPlan(null)
    } catch (error) {
      console.error('Error actualizando plan:', error)
    }
  }

  function formatPrice(value?: number | string | null) {
    if (value === null || value === undefined || value === '') return 'S/ 0.00'
    return `S/ ${Number(value).toFixed(2)}`
  }

  function formatLimit(value?: number | null) {
    if (value === null || value === undefined) return 'Ilimitado'
    return value
  }

  const columns: DataTableColumn<Plan>[] = [
    {
      key: 'id',
      header: '#',
      render: (_, index) => index + 1,
    },
    {
      key: 'nombre',
      header: 'Plan',
    },
    {
      key: 'precio_mensual',
      header: 'Precio mensual',
      render: (plan) => formatPrice(plan.precio_mensual),
    },
    {
      key: 'precio_anual',
      header: 'Precio anual',
      render: (plan) => formatPrice(plan.precio_anual),
    },
    {
      key: 'max_sucursales',
      header: 'Sucursales',
      render: (plan) => formatLimit(plan.max_sucursales),
    },
    {
      key: 'max_usuarios',
      header: 'Usuarios',
      render: (plan) => formatLimit(plan.max_usuarios),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (plan) =>
        plan.estado ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Activo
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Inactivo
          </span>
        ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (plan) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(plan)}
            className="rounded bg-cyan-600 px-3 py-1 text-xs text-white transition hover:bg-cyan-700"
          >
            Editar
          </button>
        </div>
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
          title="Planes"
          buttonText="Nuevo"
          onButtonClick={handleNew}
          icon={<ReportIcon />}
        />

        <main className="px-8 py-5">
          <DataTable
            title="Listado de planes"
            columns={columns}
            data={planes}
            isLoading={isLoading}
            error={error}
            loadingMessage="Cargando planes..."
            emptyMessage="No existen planes registrados"
          />
        </main>
      </div>

      <CreatePlanModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
        isSubmitting={isCreatingPlan}
      />

      <EditPlanModal
        open={isEditModalOpen}
        plan={editingPlan}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingPlan(null)
        }}
        onSubmit={handleUpdatePlan}
        isSubmitting={isUpdatingPlan}
      />
    </div>
  )
}

export default PlansPage