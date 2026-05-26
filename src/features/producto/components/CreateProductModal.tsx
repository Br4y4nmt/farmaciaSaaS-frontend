import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CloseIcon } from '../../../components/icons'
import { useCategorias } from '../../categoria/hooks/useCategorias'
import { InfoTooltip } from '../../../components/ui/InfoTooltip'
import CreateCategoryModal from '../../categoria/components/CreateCategoryModal'
import CreateLaboratoryModal from '../../laboratorio/components/CreateLaboratoryModal'
import CreateMarcaModal from '../../marca/components/CreateMarcaModal'
import { useStoredUser } from '../../auth/hooks/useStoredUser'
import { useLaboratorios } from '../../laboratorio/hooks/useLaboratorios'
import { useMarcas } from '../../marca/hooks/useMarcas'
import { useCreateProducto } from '../hooks/useCreateProducto'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type ActiveSection = 'general' | 'farmaceutico' | 'precios' | 'control'

type FormData = {
  categoria_id: string
  laboratorio_id: string
  marca_id: string
  codigo_barras: string
  codigo_sunat: string
  nombre_generico: string
  nombre_comercial: string
  descripcion: string
  registro_sanitario: string
  forma_farmaceutica: string
  concentracion: string
  presentacion: string
  unidad_medida: string
  principio_activo: string
  requiere_receta: boolean
  es_controlado: boolean
  es_fraccionable: boolean
  precio_compra: string
  precio_venta: string
  stock_minimo: string
  stock_maximo: string
  afecto_igv: boolean
  estado: boolean
}

const initialForm: FormData = {
  categoria_id: '',
  laboratorio_id: '',
  marca_id: '',
  codigo_barras: '',
  codigo_sunat: '',
  nombre_generico: '',
  nombre_comercial: '',
  descripcion: '',
  registro_sanitario: '',
  forma_farmaceutica: '',
  concentracion: '',
  presentacion: '',
  unidad_medida: '',
  principio_activo: '',
  requiere_receta: false,
  es_controlado: false,
  es_fraccionable: false,
  precio_compra: '',
  precio_venta: '',
  stock_minimo: '',
  stock_maximo: '',
  afecto_igv: true,
  estado: true,
}

export default function CreateProductModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<FormData>(initialForm)
  const [activeSection, setActiveSection] = useState<ActiveSection>('general')
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const user = useStoredUser()

  const {
    categorias,
    isLoading: isLoadingCategorias,
    refetch: refetchCategorias,
  } = useCategorias(user?.empresa_id, {
    estado: true,
  })


  const {
    laboratorios,
    isLoading: isLoadingLaboratorios,
    refetch: refetchLaboratorios,
  } = useLaboratorios({
    estado: true,
  })

  const {
    marcas,
    isLoading: isLoadingMarcas,
    refetch: refetchMarcas,
  } = useMarcas(user?.empresa_id, {
    estado: true,
  })

  const [openCreateCategory, setOpenCreateCategory] = useState(false)
  const [openCreateLaboratory, setOpenCreateLaboratory] = useState(false)
  const [openCreateMarca, setOpenCreateMarca] = useState(false)

  const {
    crearProducto,
    isLoading: isCreatingProducto,
    error: createError,
    setError: setCreateError,
  } = useCreateProducto()

  if (!isOpen) return null

      function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) {
        const { name, value, type } = e.target

        const checked =
          type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

        setForm((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }))

        if (error) setError(null)
        if (createError) setCreateError(null)
      }

      function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) return

        if (!file.type.startsWith('image/')) {
          setError('Solo se permiten archivos de imagen.')
          return
        }

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        setError(null)
      }

      function handleRemoveImage() {
        setImageFile(null)
        setImagePreview(null)
      }

      function handleSectionChange(section: ActiveSection) {
        setError(null)
        setActiveSection(section)
      }

    function validateForm(): {
      section: ActiveSection
      message: string
    } | null {
      if (!form.nombre_comercial.trim()) {
        return {
          section: 'general',
          message: 'Completa el campo: Nombre comercial.',
        }
      }

      if (!form.nombre_generico.trim()) {
        return {
          section: 'general',
          message: 'Completa el campo: Nombre genérico.',
        }
      }

      if (!form.categoria_id) {
        return {
          section: 'general',
          message: 'Selecciona una categoría.',
        }
      }

      if (!form.laboratorio_id) {
        return {
          section: 'general',
          message: 'Selecciona un laboratorio.',
        }
      }

      if (!form.marca_id) {
        return {
          section: 'general',
          message: 'Selecciona una marca.',
        }
      }

      if (!imageFile) {
        return {
          section: 'general',
          message: 'Selecciona una imagen del producto.',
        }
      }

      if (!form.descripcion.trim()) {
        return {
          section: 'general',
          message: 'Completa el campo: Descripción.',
        }
      }

      if (
        form.codigo_barras.trim() &&
        !/^\d{8,14}$/.test(form.codigo_barras.trim())
      ) {
        return {
          section: 'general',
          message: 'El código de barras debe contener entre 8 y 14 dígitos.',
        }
      }

      if (!form.principio_activo.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Principio activo.',
        }
      }

      if (!form.concentracion.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Concentración.',
        }
      }

      if (!form.presentacion.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Presentación.',
        }
      }

      if (!form.unidad_medida.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Unidad de medida.',
        }
      }

      if (!form.forma_farmaceutica.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Forma farmacéutica.',
        }
      }

      if (!form.registro_sanitario.trim()) {
        return {
          section: 'farmaceutico',
          message: 'Completa el campo: Registro sanitario.',
        }
      }

      if (!form.precio_compra.trim()) {
        return {
          section: 'precios',
          message: 'Completa el campo: Precio compra.',
        }
      }

      if (!form.precio_venta.trim()) {
        return {
          section: 'precios',
          message: 'Completa el campo: Precio venta.',
        }
      }

      if (!form.stock_minimo.trim()) {
        return {
          section: 'precios',
          message: 'Completa el campo: Stock mínimo.',
        }
      }

      if (!form.stock_maximo.trim()) {
        return {
          section: 'precios',
          message: 'Completa el campo: Stock máximo.',
        }
      }

      if (Number(form.precio_compra) < 0) {
        return {
          section: 'precios',
          message: 'El precio compra no puede ser negativo.',
        }
      }

      if (Number(form.precio_venta) <= 0) {
        return {
          section: 'precios',
          message: 'El precio venta debe ser mayor a 0.',
        }
      }

      if (Number(form.stock_minimo) < 0) {
        return {
          section: 'precios',
          message: 'El stock mínimo no puede ser negativo.',
        }
      }

      if (Number(form.stock_maximo) < 0) {
        return {
          section: 'precios',
          message: 'El stock máximo no puede ser negativo.',
        }
      }

      if (Number(form.stock_maximo) < Number(form.stock_minimo)) {
        return {
          section: 'precios',
          message: 'El stock máximo no puede ser menor al stock mínimo.',
        }
      }

      return null
    }


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const validationError = validateForm()

      if (validationError) {
        setActiveSection(validationError.section)
        setError(validationError.message)
        return
      }

      const payload = new FormData()

      if (form.categoria_id) {
        payload.append('categoria_id', form.categoria_id)
      }

      if (form.laboratorio_id) {
        payload.append('laboratorio_id', form.laboratorio_id)
      }

      if (form.marca_id) {
        payload.append('marca_id', form.marca_id)
      }

      if (form.codigo_barras.trim()) {
        payload.append('codigo_barras', form.codigo_barras.trim())
      }

      if (form.codigo_sunat.trim()) {
        payload.append('codigo_sunat', form.codigo_sunat.trim())
      }

      if (form.nombre_generico.trim()) {
        payload.append('nombre_generico', form.nombre_generico.trim())
      }

      payload.append('nombre_comercial', form.nombre_comercial.trim())

      if (form.descripcion.trim()) {
        payload.append('descripcion', form.descripcion.trim())
      }

      if (form.registro_sanitario.trim()) {
        payload.append('registro_sanitario', form.registro_sanitario.trim())
      }

      if (form.forma_farmaceutica.trim()) {
        payload.append('forma_farmaceutica', form.forma_farmaceutica.trim())
      }

      if (form.concentracion.trim()) {
        payload.append('concentracion', form.concentracion.trim())
      }

      if (form.presentacion.trim()) {
        payload.append('presentacion', form.presentacion.trim())
      }

      if (form.unidad_medida.trim()) {
        payload.append('unidad_medida', form.unidad_medida.trim())
      }

      if (form.principio_activo.trim()) {
        payload.append('principio_activo', form.principio_activo.trim())
      }

      payload.append('requiere_receta', String(form.requiere_receta))
      payload.append('es_controlado', String(form.es_controlado))
      payload.append('es_fraccionable', String(form.es_fraccionable))
      payload.append('afecto_igv', String(form.afecto_igv))
      payload.append('estado', String(form.estado))

      payload.append('precio_compra', String(Number(form.precio_compra || 0)))
      payload.append('precio_venta', String(Number(form.precio_venta || 0)))
      payload.append('stock_minimo', String(Number(form.stock_minimo || 0)))
      payload.append('stock_maximo', String(Number(form.stock_maximo || 0)))

      if (imageFile) {
        payload.append('imagen', imageFile)
      }

      const producto = await crearProducto(payload)

      if (!producto) return

      setForm(initialForm)
      setImageFile(null)
      setImagePreview(null)
      setActiveSection('general')
      onClose()
      onSuccess?.()
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-3xl rounded-sm border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-xl font-medium text-slate-800">
            Crear producto
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="border-b border-slate-200">
            <div className="flex gap-6 overflow-x-auto">
              <TabButton
                label="Datos generales"
                active={activeSection === 'general'}
                onClick={() => handleSectionChange('general')}
              />

              <TabButton
                label="Datos farmacéuticos"
                active={activeSection === 'farmaceutico'}
                onClick={() => handleSectionChange('farmaceutico')}
              />

              <TabButton
                label="Precios y stock"
                active={activeSection === 'precios'}
                onClick={() => handleSectionChange('precios')}
              />

              <TabButton
                label="Control"
                active={activeSection === 'control'}
                onClick={() => handleSectionChange('control')}
              />
            </div>
          </div>

          {activeSection === 'general' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Código de barras"
                name="codigo_barras"
                value={form.codigo_barras}
                onChange={handleChange}
              />

              <Input
                label="Nombre genérico"
                name="nombre_generico"
                value={form.nombre_generico}
                onChange={handleChange}
              />

              <div className="col-span-2">
                <Input
                  label="Nombre comercial"
                  name="nombre_comercial"
                  value={form.nombre_comercial}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-medium text-[#606266]">Categoría</label>

                  <button
                    type="button"
                    onClick={() => setOpenCreateCategory(true)}
                    className="cursor-pointer text-[13px] font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    [+ Nuevo]
                  </button>
                </div>

                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  disabled={isLoadingCategorias}
                  className="w-full cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="" disabled>
                    {isLoadingCategorias ? 'Cargando categorías...' : 'Seleccionar categoría'}
                  </option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={String(categoria.id)}>
                      {categoria.categoria_padre ? `${categoria.categoria_padre.nombre} → ${categoria.nombre}` : categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-medium text-[#606266]">Laboratorio</label>

                  <button
                    type="button"
                    onClick={() => setOpenCreateLaboratory(true)}
                    className="cursor-pointer text-[13px] font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    [+ Nuevo]
                  </button>
                </div>

                <select
                  name="laboratorio_id"
                  value={form.laboratorio_id}
                  onChange={handleChange}
                  disabled={isLoadingLaboratorios}
                  className="w-full cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="" disabled>
                    {isLoadingLaboratorios ? 'Cargando laboratorios...' : 'Seleccionar laboratorio'}
                  </option>

                  {laboratorios.map((laboratorio) => (
                    <option key={laboratorio.id} value={String(laboratorio.id)}>
                      {laboratorio.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-medium text-[#606266]">Marca</label>

                  <button
                    type="button"
                    onClick={() => setOpenCreateMarca(true)}
                    className="cursor-pointer text-[13px] font-semibold text-sky-600 transition hover:text-sky-700"
                  >
                    [+ Nuevo]
                  </button>
                </div>

                <select
                  name="marca_id"
                  value={form.marca_id}
                  onChange={handleChange}
                  disabled={isLoadingMarcas}
                  className="w-full cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="" disabled>
                    {isLoadingMarcas ? 'Cargando marcas...' : 'Seleccionar marca'}
                  </option>

                  {marcas.map((marca) => (
                    <option key={marca.id} value={String(marca.id)}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#606266]">
                  Imagen del producto
                </label>

                <label className="flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 transition hover:border-sky-500 hover:text-sky-600">
                  <span className="font-medium">Seleccionar imagen</span>

                  <span className="text-xs text-slate-400">
                    PNG, JPG, JPEG o WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="flex items-center gap-4 rounded border border-slate-200 p-3">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="h-20 w-20 rounded object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">
                        {imageFile?.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Imagen seleccionada correctamente
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#606266]">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {activeSection === 'farmaceutico' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Principio activo"
                name="principio_activo"
                value={form.principio_activo}
                onChange={handleChange}
                info="Sustancia principal que produce el efecto del medicamento. Ejemplo: Paracetamol, Ibuprofeno, Amoxicilina."
              />

              <Input
                label="Concentración"
                name="concentracion"
                value={form.concentracion}
                onChange={handleChange}
                info="Cantidad del principio activo. Ejemplo: 500 mg, 250 mg/5 ml, 1 g."
              />

              <Input
                label="Presentación"
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                info="Forma en la que se comercializa el producto. Ejemplo: Caja x 100 tabletas, Blíster x 10, Frasco x 120 ml."
              />

              <Input
                label="Unidad de medida"
                name="unidad_medida"
                value={form.unidad_medida}
                onChange={handleChange}
                info="Unidad base para venta o control de stock. Ejemplo: Tableta, Cápsula, Frasco, Ampolla, Sobre."
              />

              <Input
                label="Forma farmacéutica"
                name="forma_farmaceutica"
                value={form.forma_farmaceutica}
                onChange={handleChange}
                info="Forma física del medicamento. Ejemplo: Tableta, Cápsula, Jarabe, Crema, Gotas, Inyectable."
              />

              <Input
                label="Registro sanitario"
                name="registro_sanitario"
                value={form.registro_sanitario}
                onChange={handleChange}
                info="Código de autorización sanitaria del producto. Puede dejarse vacío si aún no lo tienes."
              />

              <Input
                label="Código SUNAT"
                name="codigo_sunat"
                value={form.codigo_sunat}
                onChange={handleChange}
                info="Código de catálogo SUNAT relacionado al producto. Es opcional si todavía no manejas integración tributaria."
              />
            </div>
          )}

          {activeSection === 'precios' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Precio compra"
                name="precio_compra"
                value={form.precio_compra}
                onChange={handleChange}
                info="Costo unitario del producto para la empresa. Ejemplo: 0.08 por tableta."
              />

              <Input
                type="number"
                label="Precio venta"
                name="precio_venta"
                value={form.precio_venta}
                onChange={handleChange}
                info="Precio unitario al que se venderá al cliente. Ejemplo: 0.20 por tableta."
              />

              <Input
                type="number"
                label="Stock mínimo"
                name="stock_minimo"
                value={form.stock_minimo}
                onChange={handleChange}
                info="Cantidad mínima antes de generar una alerta de reposición. Ejemplo: 20 unidades."
              />

              <Input
                type="number"
                label="Stock máximo"
                name="stock_maximo"
                value={form.stock_maximo}
                onChange={handleChange}
                info="Cantidad máxima recomendada para mantener en inventario. Ejemplo: 500 unidades."
              />
            </div>
          )}

          {activeSection === 'control' && (
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                label="Requiere receta"
                name="requiere_receta"
                checked={form.requiere_receta}
                onChange={handleChange}
              />

              <Checkbox
                label="Producto controlado"
                name="es_controlado"
                checked={form.es_controlado}
                onChange={handleChange}
              />

              <Checkbox
                label="Producto fraccionable"
                name="es_fraccionable"
                checked={form.es_fraccionable}
                onChange={handleChange}
              />

              <Checkbox
                label="Afecto a IGV"
                name="afecto_igv"
                checked={form.afecto_igv}
                onChange={handleChange}
              />

              <Checkbox
                label="Producto activo"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
            </div>
          )}

         {(error || createError) && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600">
              {error || createError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-slate-300 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreatingProducto}
              className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingProducto ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>

        <CreateCategoryModal
          isOpen={openCreateCategory}
          onClose={() => setOpenCreateCategory(false)}
          onSuccess={async () => {
            setOpenCreateCategory(false)
            await refetchCategorias()
          }}
        />

        <CreateLaboratoryModal
          isOpen={openCreateLaboratory}
          onClose={() => setOpenCreateLaboratory(false)}
          onSuccess={async () => {
            setOpenCreateLaboratory(false)
            await refetchLaboratorios()
          }}
        />

        <CreateMarcaModal
          isOpen={openCreateMarca}
          onClose={() => setOpenCreateMarca(false)}
          onSuccess={async () => {
            setOpenCreateMarca(false)
            await refetchMarcas()
          }}
        />

      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-sky-600 text-sky-600'
          : 'text-slate-500'
      }`}
    >
      {label}
    </button>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  info,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  info?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#606266]">
        <span>{label}</span>
        {info && <InfoTooltip text={info} />}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
  )
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: [string, string][]
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium text-[#606266]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
}: {
  label: string
  name: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-center gap-3 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
      />

      {label}
    </label>
  )
}