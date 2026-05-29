import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { FarmaceuticoSidebar } from '../../components/layout/siderbars/FarmaceuticoSidebar'
import { showSuccess } from '../../components/ui/sonner'
import TrashIcon from '../../components/icons/TrashIcon'
import PillIcon from '../../components/icons/PillIcon'
import { InfoTooltip } from '../../components/ui/InfoTooltip'
import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'
import { useCreateVentaRapida } from '../../features/ventas/hooks/useCreateVentaRapida'
import { useProductosVentaRapida } from '../../features/producto/hooks/useProductosVentaRapida'
import type { ProductoVenta } from '../../features/producto/types/productoVenta.types'

type CarritoItem = {
  producto: ProductoVenta
  cantidad: number
}

type MetodoPago = 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA'
type VistaProductos = 'grid' | 'list'

export default function VentaRapidaPage() {

  const user = useStoredUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [scannerMode, setScannerMode] = useState(true)
  const [search, setSearch] = useState('')
  const [vistaProductos, setVistaProductos] = useState<VistaProductos>('grid')
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('EFECTIVO')
  const [montoRecibido, setMontoRecibido] = useState('')

  const {
    productos,
    isLoading: loadingProductos,
    error: productosError,
    refetch: refetchProductos,
  } = useProductosVentaRapida()

  const {
    createVentaRapida,
    isLoading: creatingVenta,
    error: ventaError,
  } = useCreateVentaRapida()

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function formatMoney(value: number) {
    return `S/ ${value.toFixed(2)}`
  }

  const productosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return productos

    return productos.filter((producto) => {
      return (
        producto.codigo.toLowerCase().includes(term) ||
        producto.codigo_barras?.toLowerCase().includes(term) ||
        producto.nombre_comercial.toLowerCase().includes(term) ||
        producto.nombre_generico?.toLowerCase().includes(term)
      )
    })
  }, [productos, search])

  const subtotal = carrito.reduce((acc, item) => {
    return acc + item.producto.precio_venta * item.cantidad
  }, 0)

  const igv = subtotal * 0.18
  const total = subtotal

  const montoPagado =
    metodoPago === 'EFECTIVO' ? Number(montoRecibido || 0) : total

  const vuelto = Math.max(montoPagado - total, 0)

  const puedeCobrar =
    carrito.length > 0 &&
    (metodoPago !== 'EFECTIVO' || Number(montoRecibido || 0) >= total)

  function handleAddProducto(producto: ProductoVenta) {
    if (producto.stock_disponible <= 0) {
      alert('Este producto no tiene stock disponible.')
      return
    }

    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id)

      if (existente) {
        return prev.map((item) => {
          if (item.producto.id !== producto.id) return item

          return {
            ...item,
            cantidad: Math.min(
              item.cantidad + 1,
              item.producto.stock_disponible,
            ),
          }
        })
      }

      return [...prev, { producto, cantidad: 1 }]
    })

    setSearch('')
    showSuccess(`${producto.nombre_comercial} agregado`)
  }

  function handleRemoveProducto(productoId: number) {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId))
  }

  function handleChangeCantidad(productoId: number, value: string) {
    const cantidad = Number(value)

    setCarrito((prev) =>
      prev.map((item) => {
        if (item.producto.id !== productoId) return item

        if (!cantidad || cantidad < 1) {
          return { ...item, cantidad: 1 }
        }

        return {
          ...item,
          cantidad: Math.min(cantidad, item.producto.stock_disponible),
        }
      }),
    )
  }

  function handleClearCart() {
    setCarrito([])
    setMetodoPago('EFECTIVO')
    setMontoRecibido('')
  }

  async function handleCobrar() {
    if (carrito.length === 0) {
      alert('Agrega al menos un producto a la venta.')
      return
    }

    if (metodoPago === 'EFECTIVO' && Number(montoRecibido || 0) < total) {
      alert('El monto recibido no puede ser menor al total.')
      return
    }

    const response = await createVentaRapida({
      metodo_pago: metodoPago,
      monto_recibido: metodoPago === 'EFECTIVO' ? Number(montoRecibido || 0) : total,
      items: carrito.map((item) => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
      })),
    })

    if (!response) return

    showSuccess('Venta registrada correctamente')

    handleClearCart()
    refetchProductos()
  }

  return (
    <div className="flex min-h-screen bg-slate-100 venta-rapida">
      <style>{`
        .venta-rapida button{cursor: pointer}

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }

        .venta-rapida .cart-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148,163,184,0.7) transparent;
        }

        .venta-rapida .cart-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .venta-rapida .cart-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .venta-rapida .cart-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(148,163,184,0.7);
          border-radius: 9999px;
          border: 2px solid rgba(255,255,255,0.8);
        }
      `}</style>

      <FarmaceuticoSidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminEmpresaHeader
          user={user}
          onLogout={handleLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.95fr]">
            <section className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              <div className="space-y-4 border-b border-slate-200 px-4 py-3">
                <label className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setScannerMode((prev) => !prev)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      scannerMode ? 'bg-sky-500' : 'bg-slate-900'
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition ${
                        scannerMode ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    />
                  </button>

                  <span
                    className={`text-sm font-medium ${
                      scannerMode ? 'text-sky-500' : 'text-slate-900'
                    }`}
                  >
                    Buscar con escáner de código de barras
                  </span>
                </label>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar productos"
                      className="w-full rounded-sm border border-slate-300 px-3 py-1 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />

                    {/* Nuevo producto button removed for farmaceutico */}
                  </div>

                  <div className="ml-3 flex items-center gap-2">
                    <InfoTooltip text="Vista de productos">
                      <button
                        type="button"
                        onClick={() => setVistaProductos('grid')}
                        className={`h-8 rounded-sm px-3 text-sm font-medium ${
                          vistaProductos === 'grid'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 bg-white text-slate-600'
                        }`}
                        aria-label="Vista de grilla"
                      >
                        ⊞
                      </button>
                    </InfoTooltip>

                    <InfoTooltip text="Lista de productos">
                      <button
                        type="button"
                        onClick={() => setVistaProductos('list')}
                        className={`h-8 rounded-sm px-3 text-sm font-medium ${
                          vistaProductos === 'list'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 bg-white text-slate-600'
                        }`}
                        aria-label="Vista de lista"
                      >
                        ☰
                      </button>
                    </InfoTooltip>
                  </div>
                </div>
              </div>

              <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-4">
                {loadingProductos ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                    Cargando productos...
                  </div>
                ) : productosError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600">
                    {productosError}
                  </div>
                ) : productosFiltrados.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                    No se encontraron productos con stock disponible.
                  </div>
                ) : vistaProductos === 'grid' ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {productosFiltrados.map((producto) => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => handleAddProducto(producto)}
                        disabled={producto.stock_disponible <= 0}
                        className="group overflow-hidden rounded-md border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="min-h-[44px] text-sm font-bold uppercase leading-5 text-slate-800">
                              {producto.nombre_comercial}
                            </h4>

                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              {formatMoney(producto.precio_venta)}
                            </span>
                          </div>

                          <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
                            {producto.imagen_url ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${producto.imagen_url}`}
                                alt={producto.nombre_comercial}
                                className="h-full w-full rounded-xl object-contain p-2"
                              />
                            ) : (
                              <PillIcon className="h-16 w-16 text-slate-300 transition group-hover:scale-105" />
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs">
                            <span
                              className={`rounded-full px-2.5 py-1 font-medium ${
                                producto.stock_disponible <= 5
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Stock: {producto.stock_disponible}
                            </span>

                            <span className="text-xs font-medium text-sky-600 opacity-0 transition group-hover:opacity-100">
                              Agregar
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                            <span className="truncate">{producto.codigo}</span>
                            <span className="truncate">
                              {producto.codigo_barras || '-'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productosFiltrados.map((producto) => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => handleAddProducto(producto)}
                        disabled={producto.stock_disponible <= 0}
                        className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">
                            {producto.nombre_comercial}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {producto.nombre_generico || 'Sin nombre genérico'}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                            <span className="rounded bg-slate-100 px-2 py-1">
                              {producto.codigo}
                            </span>

                            <span className="rounded bg-slate-100 px-2 py-1">
                              {producto.codigo_barras || '-'}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 text-right">
                          <p className="font-bold text-slate-900">
                            {formatMoney(producto.precio_venta)}
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              producto.stock_disponible <= 5
                                ? 'text-red-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            Stock: {producto.stock_disponible}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <aside className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
              <div className="flex h-full flex-col">
                <div className="space-y-4 border-b border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Comprobante
                      </p>
                      <div className="mt-1 inline-flex rounded-sm bg-sky-500 px-4 py-2 text-sm font-semibold text-white">
                        Nota de venta
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Modo
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        Venta rápida
                      </p>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Cliente
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      Cliente varios
                    </p>
                  </div>
                </div>

                <div className="max-h-[330px] min-h-[200px] overflow-y-auto border-b border-slate-200 p-4 cart-scroll">
                  {carrito.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                      <div>
                        <p className="font-medium text-slate-700">
                          No hay productos en la venta
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Agrega productos desde el panel izquierdo.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {carrito.map((item) => (
                        <div
                          key={item.producto.id}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex w-28 flex-shrink-0 items-center gap-2">
                              <div className="whitespace-nowrap text-[8px] font-medium text-slate-500">
                                NIU
                              </div>

                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="\\d*"
                                min={1}
                                max={item.producto.stock_disponible}
                                value={String(item.cantidad)}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, '')
                                  const num = digits
                                    ? Math.max(
                                        1,
                                        Math.min(
                                          Number(digits),
                                          item.producto.stock_disponible,
                                        ),
                                      )
                                    : 1

                                  handleChangeCantidad(
                                    item.producto.id,
                                    String(num),
                                  )
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === 'ArrowUp' ||
                                    e.key === 'ArrowDown'
                                  ) {
                                    e.preventDefault()
                                  }
                                }}
                                className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1 text-center text-sm outline-none focus:border-sky-500"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {item.producto.nombre_comercial}
                              </p>

                              <p className="mt-1 text-xs leading-snug text-slate-500">
                                {item.producto.nombre_generico || ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800">
                                {formatMoney(
                                  item.producto.precio_venta * item.cantidad,
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveProducto(item.producto.id)
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                                aria-label="Quitar producto"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t border-slate-200 p-4">
                  <div className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="text-right font-medium text-slate-700">
                      {formatMoney(subtotal)}
                    </span>

                    <span className="text-slate-500">IGV</span>

                    <span className="text-right font-medium text-slate-700">
                      {formatMoney(igv)}
                    </span>

                    <span className="pt-1 text-lg font-semibold text-slate-800">
                      IMPORTE TOTAL
                    </span>

                    <span className="text-right text-3xl font-bold text-slate-900">
                      {formatMoney(total)}
                    </span>

                    <span className="text-slate-500">Importe pagado</span>

                    <span className="text-right font-medium text-slate-700">
                      {formatMoney(montoPagado)}
                    </span>

                    <span className="text-slate-500">Vuelto</span>

                    <span className="text-right font-medium text-slate-700">
                      {formatMoney(vuelto)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Método de pago
                      </label>

                      <select
                        value={metodoPago}
                        onChange={(e) => {
                          const value = e.target.value as MetodoPago
                          setMetodoPago(value)

                          if (value !== 'EFECTIVO') {
                            setMontoRecibido(total > 0 ? total.toFixed(2) : '')
                          } else {
                            setMontoRecibido('')
                          }
                        }}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="YAPE">Yape</option>
                        <option value="PLIN">Plin</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Monto
                      </label>

                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={
                          metodoPago === 'EFECTIVO'
                            ? montoRecibido
                            : total > 0
                              ? String(total.toFixed(2))
                              : ''
                        }
                        onChange={(e) => setMontoRecibido(e.target.value)}
                        disabled={metodoPago !== 'EFECTIVO'}
                        className="w-full rounded-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Vuelto
                      </label>

                      <div className="mt-1 rounded-sm border border-slate-200 px-3 py-2 text-right text-sm font-semibold text-slate-800">
                        {formatMoney(vuelto)}
                      </div>
                    </div>
                  </div>
                </div>
                {ventaError && (
                <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
                  {ventaError}
                </div>
              )}

                <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={carrito.length === 0 || creatingVenta}
                  className="rounded-sm border border-slate-300 bg-white px-4 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  LIMPIAR
                </button>

                <button
                  type="button"
                  onClick={handleCobrar}
                  disabled={!puedeCobrar || creatingVenta}
                  className="rounded-sm bg-sky-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingVenta ? 'COBRANDO...' : 'COBRAR'}
                </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* CreateProductModal removed for farmaceutico */}
    </div>
  )
}