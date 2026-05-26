import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AdminEmpresaHeader } from '../../components/layout/headers/AdminEmpresaHeader'
import { AdminEmpresaSidebar } from '../../components/layout/siderbars/AdminEmpresaSidebar'
import { showSuccess } from '../../components/ui/sonner'
import TrashIcon from '../../components/icons/TrashIcon'
import PillIcon from '../../components/icons/PillIcon'
import CreateProductModal from '../../features/producto/components/CreateProductModal'
import { InfoTooltip } from '../../components/ui/InfoTooltip'

import { useStoredUser } from '../../features/auth/hooks/useStoredUser'
import { clearStoredUser } from '../../features/auth/utils/authStorage'

type ProductoVenta = {
  id: number
  codigo: string
  codigo_barras: string
  nombre_comercial: string
  nombre_generico?: string
  precio_venta: number
  stock_disponible: number
}

type CarritoItem = {
  producto: ProductoVenta
  cantidad: number
}

type MetodoPago = 'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA'
type TipoComprobante = 'FACTURA' | 'BOLETA' | 'N_VENTA'
type VistaProductos = 'grid' | 'list'

const productosDemo: ProductoVenta[] = [
  {
    id: 1,
    codigo: 'PRO0001',
    codigo_barras: '2000200000013',
    nombre_comercial: 'Paracetamol 500mg',
    nombre_generico: 'Paracetamol',
    precio_venta: 2.0,
    stock_disponible: 25,
  },
  {
    id: 2,
    codigo: 'PRO0002',
    codigo_barras: '2000200000020',
    nombre_comercial: 'Ibuprofeno 400mg',
    nombre_generico: 'Ibuprofeno',
    precio_venta: 3.5,
    stock_disponible: 12,
  },
  {
    id: 3,
    codigo: 'PRO0003',
    codigo_barras: '2000200000037',
    nombre_comercial: 'Alcohol 70%',
    nombre_generico: 'Alcohol medicinal',
    precio_venta: 5.0,
    stock_disponible: 8,
  },
  {
    id: 4,
    codigo: 'PRO0004',
    codigo_barras: '2000200000044',
    nombre_comercial: 'Amoxicilina 500mg',
    nombre_generico: 'Amoxicilina',
    precio_venta: 8.5,
    stock_disponible: 14,
  },
  {
    id: 5,
    codigo: 'PRO0005',
    codigo_barras: '2000200000051',
    nombre_comercial: 'Vitamina C 1g',
    nombre_generico: 'Ácido ascórbico',
    precio_venta: 4.2,
    stock_disponible: 30,
  },
  {
    id: 6,
    codigo: 'PRO0006',
    codigo_barras: '2000200000068',
    nombre_comercial: 'Loratadina 10mg',
    nombre_generico: 'Loratadina',
    precio_venta: 2.8,
    stock_disponible: 16,
  },
]

export default function VentaRapidaPage() {
  const [openCreateProduct, setOpenCreateProduct] = useState(false)

  const user = useStoredUser()
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)

  const [scannerMode, setScannerMode] = useState(true)
  const [search, setSearch] = useState('')
  const [vistaProductos, setVistaProductos] = useState<VistaProductos>('grid')

  const [tipoComprobante, setTipoComprobante] =
    useState<TipoComprobante>('BOLETA')

  const [cliente, setCliente] = useState('CLIENTE VARIOS')
  const [serie, setSerie] = useState('B001')

  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('EFECTIVO')
  const [destino, setDestino] = useState('CAJA GENERAL')
  const [montoRecibido, setMontoRecibido] = useState('')

  function handleLogout() {
    clearStoredUser()
    navigate('/login', { replace: true })
  }

  function formatMoney(value: number) {
    return `S/ ${value.toFixed(2)}`
  }

  function handleTipoComprobanteChange(tipo: TipoComprobante) {
    setTipoComprobante(tipo)

    if (tipo === 'FACTURA') {
      setSerie('F001')
      setCliente('')
      return
    }

    if (tipo === 'BOLETA') {
      setSerie('B001')
      setCliente('CLIENTE VARIOS')
      return
    }

    setSerie('NV01')
    setCliente('CLIENTE VARIOS')
  }

  const productosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return productosDemo

    return productosDemo.filter((producto) => {
      return (
        producto.codigo.toLowerCase().includes(term) ||
        producto.codigo_barras.toLowerCase().includes(term) ||
        producto.nombre_comercial.toLowerCase().includes(term) ||
        producto.nombre_generico?.toLowerCase().includes(term)
      )
    })
  }, [search])

  const subtotal = carrito.reduce((acc, item) => {
    return acc + item.producto.precio_venta * item.cantidad
  }, 0)

  const igv = subtotal * 0.18
  const total = subtotal
  const vuelto = Math.max(Number(montoRecibido || 0) - total, 0)

  function handleAddProducto(producto: ProductoVenta) {
    if (producto.stock_disponible <= 0) return

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
    setCliente(tipoComprobante === 'FACTURA' ? '' : 'CLIENTE VARIOS')
    setMetodoPago('EFECTIVO')
    setMontoRecibido('')
  }

  function handleCobrar() {
    if (carrito.length === 0) {
      alert('Agrega al menos un producto a la venta.')
      return
    }

    if (tipoComprobante === 'FACTURA' && !cliente.trim()) {
      alert('Selecciona un cliente para emitir factura.')
      return
    }

    if (metodoPago === 'EFECTIVO' && Number(montoRecibido || 0) < total) {
      alert('El monto recibido no puede ser menor al total.')
      return
    }

    console.log('Venta rápida:', {
      tipoComprobante,
      cliente: tipoComprobante === 'FACTURA' ? cliente : 'CLIENTE VARIOS',
      serie,
      carrito,
      subtotal,
      igv,
      total,
      metodoPago,
      destino,
      montoRecibido,
      vuelto,
    })

    alert('Venta registrada correctamente. Luego conectaremos esta acción con la API.')
    handleClearCart()
  }

  return (
    <div className="flex min-h-screen bg-slate-100 venta-rapida">
      <style>{`
        .venta-rapida button{cursor: pointer}
        /* Oculta los spinners de los inputs type=number */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* Scroll personalizado para el panel de carrito */
        .venta-rapida .cart-scroll {
          scrollbar-width: thin; /* Firefox */
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

      <AdminEmpresaSidebar collapsed={collapsed} />

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

                    <InfoTooltip text="Nuevo producto">
                      <button
                        type="button"
                        className="rounded-sm border border-slate-300 bg-white px-3 py-1 text-base font-medium text-slate-600 transition hover:bg-slate-50"
                        onClick={() => setOpenCreateProduct(true)}
                        aria-label="Nuevo producto"
                      >
                        +
                      </button>
                    </InfoTooltip>
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
                {productosFiltrados.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                    No se encontraron productos.
                  </div>
                ) : vistaProductos === 'grid' ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {productosFiltrados.map((producto) => (
                      <button
                        key={producto.id}
                        type="button"
                        onClick={() => handleAddProducto(producto)}
                        className="overflow-hidden rounded-md border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md"
                      >
                        <div className="p-4">
                          <h4 className="min-h-[50px] text-sm font-semibold uppercase leading-5 text-slate-700">
                            {producto.nombre_comercial}
                          </h4>

                          <div className="mt-4 flex h-28 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <PillIcon className="h-16 w-16 text-slate-300" />
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                              Stock: {producto.stock_disponible}
                            </span>

                            <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                              {formatMoney(producto.precio_venta)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{producto.codigo}</span>
                            <span>{producto.codigo_barras}</span>
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
                        className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
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
                              {producto.codigo_barras}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 text-right">
                          <p className="font-bold text-slate-900">
                            {formatMoney(producto.precio_venta)}
                          </p>

                          <p className="mt-1 text-xs text-emerald-600">
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
                    <div className="inline-flex overflow-hidden rounded-sm border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleTipoComprobanteChange('FACTURA')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          tipoComprobante === 'FACTURA'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white text-slate-600 hover:bg-sky-500 hover:text-white'
                        }`}
                      >
                        FACTURA
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTipoComprobanteChange('BOLETA')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          tipoComprobante === 'BOLETA'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white text-slate-600 hover:bg-sky-500 hover:text-white'
                        }`}
                      >
                        BOLETA
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTipoComprobanteChange('N_VENTA')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          tipoComprobante === 'N_VENTA'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white text-slate-600 hover:bg-sky-500 hover:text-white'
                        }`}
                      >
                        N. VENTA
                      </button>
                    </div>

                    <select
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                      className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
                    >
                      {tipoComprobante === 'FACTURA' && (
                        <option value="F001">F001</option>
                      )}

                      {tipoComprobante === 'BOLETA' && (
                        <option value="B001">B001</option>
                      )}

                      {tipoComprobante === 'N_VENTA' && (
                        <option value="NV01">NV01</option>
                      )}
                    </select>
                  </div>

                  <div>
                    {tipoComprobante === 'FACTURA' ? (
                      <select
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                      >
                        <option value="">Seleccionar cliente para factura</option>
                        <option value="JUAN PEREZ">JUAN PEREZ</option>
                        <option value="MARIA LOPEZ">MARIA LOPEZ</option>
                      </select>
                    ) : (
                      <div className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700">
                        CLIENTE VARIOS
                      </div>
                    )}
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
                      {metodoPago === 'EFECTIVO'
                        ? formatMoney(Number(montoRecibido || 0))
                        : formatMoney(total)}
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
                        onChange={(e) =>
                          setMetodoPago(e.target.value as MetodoPago)
                        }
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

                <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50 p-4">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="rounded-sm border border-slate-300 bg-white px-4 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    LIMPIAR
                  </button>

                  <button
                    type="button"
                    onClick={handleCobrar}
                    className="rounded-sm bg-sky-500 px-4 py-4 text-base font-semibold text-white transition hover:bg-sky-800"
                  >
                    COBRAR
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <CreateProductModal
        isOpen={openCreateProduct}
        onClose={() => setOpenCreateProduct(false)}
        onSuccess={() => setOpenCreateProduct(false)}
      />
    </div>
  )
}