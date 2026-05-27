import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { DataTable } from '../../components/ui/DataTable'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { PageHeader } from '../../components/ui/PageHeader'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

import { ExportIcon, InventoryIcon } from '../../components/icons'

type EstadoStock = 'AGOTADO' | 'CRITICO' | 'BAJO' | 'NORMAL' | 'SOBRESTOCK'

type StockSucursal = {
  id: number
  inventario_id: number | null

  sucursal_id: number
  sucursal_codigo: string | null
  sucursal_nombre: string
  sucursal_direccion: string | null
  sucursal_departamento: string | null
  sucursal_provincia: string | null
  sucursal_distrito: string | null

  producto_id: number
  codigo: string | null
  codigo_barras: string | null
  nombre_generico: string | null
  nombre_comercial: string

  categoria: string | null
  laboratorio: string | null
  marca: string | null
  unidad_medida: string | null

  stock_actual: number
  stock_reservado: number
  stock_disponible: number
  stock_minimo: number
  stock_maximo: number

  ubicacion: string | null
  estado: boolean
  estado_stock: EstadoStock
}

const stockPorSucursalDemo: StockSucursal[] = [
  {
    id: 1,
    inventario_id: 1,

    sucursal_id: 1,
    sucursal_codigo: 'SUC001',
    sucursal_nombre: 'Laboratorios Normon S.A.',
    sucursal_direccion: 'Av. Principal 123',
    sucursal_departamento: 'Huánuco',
    sucursal_provincia: 'Huánuco',
    sucursal_distrito: 'Amarilis',

    producto_id: 1,
    codigo: 'PRO0001',
    codigo_barras: '2000200000013',
    nombre_generico: 'probando',
    nombre_comercial: 'probando nombre comercial',

    categoria: 'jarabe',
    laboratorio: 'Bayer',
    marca: 'Acme',
    unidad_medida: 'Capsula',

    stock_actual: 200,
    stock_reservado: 0,
    stock_disponible: 200,
    stock_minimo: 10,
    stock_maximo: 100,

    ubicacion: 'Estante A1',
    estado: true,
    estado_stock: 'SOBRESTOCK',
  },
  {
    id: 2,
    inventario_id: 2,

    sucursal_id: 2,
    sucursal_codigo: 'SUC002',
    sucursal_nombre: 'Sucursal Centro',
    sucursal_direccion: 'Jr. Dos de Mayo 456',
    sucursal_departamento: 'Huánuco',
    sucursal_provincia: 'Huánuco',
    sucursal_distrito: 'Huánuco',

    producto_id: 2,
    codigo: 'PRO0002',
    codigo_barras: '2000200000020',
    nombre_generico: 'Ibuprofeno',
    nombre_comercial: 'Ibuprofeno 400mg',

    categoria: 'Analgésicos',
    laboratorio: 'Genfar',
    marca: 'MK',
    unidad_medida: 'Tableta',

    stock_actual: 8,
    stock_reservado: 0,
    stock_disponible: 8,
    stock_minimo: 10,
    stock_maximo: 80,

    ubicacion: 'Mostrador 2',
    estado: true,
    estado_stock: 'BAJO',
  },
  {
    id: 3,
    inventario_id: 3,

    sucursal_id: 1,
    sucursal_codigo: 'SUC001',
    sucursal_nombre: 'Laboratorios Normon S.A.',
    sucursal_direccion: 'Av. Principal 123',
    sucursal_departamento: 'Huánuco',
    sucursal_provincia: 'Huánuco',
    sucursal_distrito: 'Amarilis',

    producto_id: 3,
    codigo: 'PRO0003',
    codigo_barras: '2000200000037',
    nombre_generico: 'Alcohol medicinal',
    nombre_comercial: 'Alcohol 70%',

    categoria: 'Antisépticos',
    laboratorio: 'Medifarma',
    marca: 'Alcoholfarma',
    unidad_medida: 'Frasco',

    stock_actual: 0,
    stock_reservado: 0,
    stock_disponible: 0,
    stock_minimo: 5,
    stock_maximo: 50,

    ubicacion: null,
    estado: true,
    estado_stock: 'AGOTADO',
  },
]

export function StockPorSucursalPage() {
  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [sucursalFilter, setSucursalFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function handleExportar() {
    console.log('Exportar stock por sucursal')
  }

  function getEstadoStockLabel(estadoStock: EstadoStock) {
    const labels: Record<EstadoStock, string> = {
      AGOTADO: 'Agotado',
      CRITICO: 'Crítico',
      BAJO: 'Bajo',
      SOBRESTOCK: 'Sobrestock',
      NORMAL: 'Normal',
    }

    return labels[estadoStock]
  }

  function getEstadoStockClass(estadoStock: EstadoStock) {
    const styles: Record<EstadoStock, string> = {
      AGOTADO: 'bg-red-100 text-red-700',
      CRITICO: 'bg-orange-100 text-orange-700',
      BAJO: 'bg-yellow-100 text-yellow-700',
      SOBRESTOCK: 'bg-purple-100 text-purple-700',
      NORMAL: 'bg-green-100 text-green-700',
    }

    return styles[estadoStock]
  }

  function formatLocation(item: StockSucursal) {
    const parts = [
      item.sucursal_departamento,
      item.sucursal_provincia,
      item.sucursal_distrito,
    ].filter(Boolean)

    return parts.length > 0 ? parts.join(' / ') : null
  }

  const sucursalesOptions = useMemo(() => {
    const map = new Map<number, StockSucursal>()

    stockPorSucursalDemo.forEach((item) => {
      if (!map.has(item.sucursal_id)) {
        map.set(item.sucursal_id, item)
      }
    })

    return Array.from(map.values())
  }, [])

  const stockFiltrado = useMemo(() => {
    const term = search.trim().toLowerCase()

    return stockPorSucursalDemo.filter((item) => {
      const matchSearch =
        !term ||
        item.nombre_comercial.toLowerCase().includes(term) ||
        item.nombre_generico?.toLowerCase().includes(term) ||
        item.codigo?.toLowerCase().includes(term) ||
        item.codigo_barras?.toLowerCase().includes(term) ||
        item.sucursal_nombre.toLowerCase().includes(term)

      const matchSucursal =
        !sucursalFilter || String(item.sucursal_id) === sucursalFilter

      const matchEstado = !estadoFilter || item.estado_stock === estadoFilter

      return matchSearch && matchSucursal && matchEstado
    })
  }, [search, sucursalFilter, estadoFilter])

  const resumen = useMemo(() => {
    return {
      total_items: stockFiltrado.length,
      stock_total: stockFiltrado.reduce(
        (total, item) => total + item.stock_actual,
        0,
      ),
      disponible: stockFiltrado.reduce(
        (total, item) => total + item.stock_disponible,
        0,
      ),
      reservado: stockFiltrado.reduce(
        (total, item) => total + item.stock_reservado,
        0,
      ),
      agotados: stockFiltrado.filter((item) => item.estado_stock === 'AGOTADO')
        .length,
      bajos: stockFiltrado.filter(
        (item) => item.estado_stock === 'BAJO' || item.estado_stock === 'CRITICO',
      ).length,
    }
  }, [stockFiltrado])

  const columns: DataTableColumn<StockSucursal>[] = [
    {
      key: 'sucursal',
      header: 'Sucursal',
      render: (item) => {
        const location = formatLocation(item)

        return (
          <div>
            <p className="font-medium text-slate-800">
              {item.sucursal_nombre}
            </p>

            <p className="text-xs text-slate-500">
              {item.sucursal_codigo || 'Sin código'}
            </p>

            {location && (
              <p className="mt-1 text-[11px] text-slate-400">{location}</p>
            )}
          </div>
        )
      },
    },
    {
      key: 'producto',
      header: 'Producto',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-800">
            {item.nombre_comercial || '-'}
          </p>

          <p className="text-xs text-slate-500">
            {item.nombre_generico || 'Sin nombre genérico'}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {item.codigo || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.categoria || '-'}
        </span>
      ),
    },
    {
      key: 'laboratorio',
      header: 'Laboratorio',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.laboratorio || '-'}
        </span>
      ),
    },
    {
      key: 'marca',
      header: 'Marca',
      render: (item) => (
        <span className="text-sm text-slate-700">{item.marca || '-'}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item) => (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Actual: {item.stock_actual}
            </span>

            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
              Disponible: {item.stock_disponible}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Reservado: {item.stock_reservado}
          </p>
        </div>
      ),
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      render: (item) => (
        <span className="text-sm text-slate-700">
          {item.ubicacion || '-'}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado stock',
      render: (item) => (
        <div className="space-y-1">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getEstadoStockClass(
              item.estado_stock,
            )}`}
          >
            {getEstadoStockLabel(item.estado_stock)}
          </span>

          <p
            className={`text-[11px] ${
              item.estado ? 'text-slate-500' : 'text-red-500'
            }`}
          >
            {item.estado ? 'Inventario activo' : 'Inventario inactivo'}
          </p>
        </div>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin-empresa/inventario/lotes?producto_id=${item.producto_id}&sucursal_id=${item.sucursal_id}`,
              )
            }
            className="rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Lotes
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin-empresa/inventario/movimientos-kardex?producto_id=${item.producto_id}&sucursal_id=${item.sucursal_id}`,
              )
            }
            className="rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Kardex
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin-empresa/inventario/ajustes?producto_id=${item.producto_id}&sucursal_id=${item.sucursal_id}`,
              )
            }
            className="rounded bg-slate-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            Ajustar
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminEmpresaSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <PageHeader
          title="Stock por Sucursal"
          icon={<InventoryIcon />}
          actions={
            <button
              onClick={handleExportar}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1.5 text-[12px] font-normal text-white transition hover:bg-slate-800"
            >
              <ExportIcon />
              Exportar
            </button>
          }
        />

        <main className="px-8 py-5">
          <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
            <ResumenCard label="Registros" value={resumen.total_items} />
            <ResumenCard label="Stock total" value={resumen.stock_total} />
            <ResumenCard label="Disponible" value={resumen.disponible} />
            <ResumenCard label="Reservado" value={resumen.reservado} />
            <ResumenCard label="Agotados" value={resumen.agotados} />
            <ResumenCard label="Bajos" value={resumen.bajos} />
          </section>

          <section className="mb-5 rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_220px_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por producto, código, código de barras o sucursal..."
                className="rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />

              <select
                value={sucursalFilter}
                onChange={(e) => setSucursalFilter(e.target.value)}
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas las sucursales</option>

                {sucursalesOptions.map((item) => (
                  <option key={item.sucursal_id} value={item.sucursal_id}>
                    {item.sucursal_nombre}
                  </option>
                ))}
              </select>

              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todos los estados</option>
                <option value="NORMAL">Normal</option>
                <option value="BAJO">Bajo</option>
                <option value="CRITICO">Crítico</option>
                <option value="AGOTADO">Agotado</option>
                <option value="SOBRESTOCK">Sobrestock</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSucursalFilter('')
                  setEstadoFilter('')
                }}
                className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </section>

          <DataTable
            title="Listado de stock por sucursal"
            columns={columns}
            data={stockFiltrado}
            isLoading={false}
            error={null}
            loadingMessage="Cargando stock por sucursal..."
            emptyMessage="No existe stock por sucursal"
          />
        </main>
      </div>
    </div>
  )
}

function ResumenCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default StockPorSucursalPage