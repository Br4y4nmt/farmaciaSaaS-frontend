import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { CloseIcon } from '../../../components/icons'

type ProductoBarcode = {
  id: number
  codigo?: string | null
  codigo_barras?: string | null
  nombre_comercial: string
  nombre_generico?: string | null
  precio_venta?: number | string | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  producto: ProductoBarcode | null
}

export default function ProductBarcodeModal({
  isOpen,
  onClose,
  producto,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [copied, setCopied] = useState(false)

  const codigoBarras = producto?.codigo_barras || ''

  useEffect(() => {
    if (!isOpen || !codigoBarras || !svgRef.current) return

    try {
      JsBarcode(svgRef.current, codigoBarras, {
        format: 'EAN13',
        displayValue: false,
        margin: 0,
        width: 2,
        height: 82,
        background: '#ffffff',
        lineColor: '#111827',
      })
    } catch (error) {
      console.error('Error al generar código de barras:', error)
    }
  }, [isOpen, codigoBarras])

  useEffect(() => {
    if (!copied) return

    const timer = window.setTimeout(() => {
      setCopied(false)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [copied])

  if (!isOpen) return null

  const precioVenta =
    producto?.precio_venta !== undefined &&
    producto?.precio_venta !== null &&
    producto?.precio_venta !== ''
      ? `S/ ${Number(producto.precio_venta).toFixed(2)}`
      : null

  function sanitizeFileName(value: string) {
    return value
      .trim()
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80)
  }

  function handleDownload() {
    const barcodeValue = producto?.codigo_barras

    if (!svgRef.current || !producto || !barcodeValue) return

    const svg = svgRef.current
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)

    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    })

    const url = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = () => {
      const scale = 3
      const paddingX = 48
      const paddingTop = 20
      const paddingBottom = 20
      const codeTextHeight = 28

      const canvas = document.createElement('canvas')

      canvas.width = Math.max(image.width + paddingX * 2, 520) * scale
      canvas.height = (image.height + paddingTop + codeTextHeight + 24) * scale

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(url)
        return
      }

      ctx.scale(scale, scale)

      const canvasWidth = canvas.width / scale
      const canvasHeight = canvas.height / scale

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      ctx.fillStyle = '#111827'
      ctx.font = '600 15px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

        const imageX = (canvasWidth - image.width) / 2
        const imageY = paddingTop

        ctx.drawImage(image, imageX, imageY, image.width, image.height)

        ctx.font = '600 16px Arial'
        ctx.fillText(barcodeValue, canvasWidth / 2, imageY + image.height + 28)


      const pngUrl = canvas.toDataURL('image/png')

      const fileNameBase = producto.codigo
        ? `${producto.codigo}_${barcodeValue}`
        : barcodeValue

      const link = document.createElement('a')
      link.href = pngUrl
      link.download = `${sanitizeFileName(fileNameBase)}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
    }

    image.src = url
  }

  function handlePrint() {
    const barcodeValue = producto?.codigo_barras

    if (!svgRef.current || !producto || !barcodeValue) return

    const printWindow = window.open('', '_blank', 'width=700,height=500')

    if (!printWindow) return

    const barcodeSvg = svgRef.current.outerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Imprimir código de barras</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              background: #ffffff;
              color: #111827;
              text-align: center;
            }

            .label {
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 7px;
              width: 320px;
              min-height: 170px;
              padding: 12px 14px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #ffffff;
            }

            .product-name {
              max-width: 290px;
              font-size: 13px;
              font-weight: 700;
              line-height: 1.2;
              color: #111827;
            }

            .product-generic {
              max-width: 290px;
              font-size: 11px;
              line-height: 1.2;
              color: #6b7280;
            }

            .product-code {
              font-size: 11px;
              color: #4b5563;
            }

            .barcode-number {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 2px;
              color: #111827;
            }

            .price {
              font-size: 13px;
              font-weight: 700;
              color: #111827;
            }

            svg {
              max-width: 100%;
              height: auto;
            }

            @media print {
              body {
                padding: 0;
              }

              .label {
                border: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="label">
            <div class="product-name">${producto.nombre_comercial}</div>

            ${
              producto.nombre_generico
                ? `<div class="product-generic">${producto.nombre_generico}</div>`
                : ''
            }

            ${
              producto.codigo
                ? `<div class="product-code">Código: ${producto.codigo}</div>`
                : ''
            }

            ${barcodeSvg}

            <div class="barcode-number">${barcodeValue}</div>

            ${precioVenta ? `<div class="price">${precioVenta}</div>` : ''}
          </div>

          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  async function handleCopyCode() {
    const barcodeValue = producto?.codigo_barras

    if (!barcodeValue) return

    try {
      await navigator.clipboard.writeText(barcodeValue)
      setCopied(true)
    } catch (error) {
      console.error('Error al copiar código:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} />

      <div className="relative w-full max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between px-6 py-5">
          <div>

            <h3 className="text-xl font-semibold text-slate-900">
              Código de barras
            </h3>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {!producto ? (
            <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              No se encontró información del producto.
            </div>
          ) : !codigoBarras ? (
            <div className="rounded-md border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              Este producto no tiene código de barras registrado.
            </div>
          ) : (
            <>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-900">
                      {producto.nombre_comercial}
                    </p>

                    {producto.nombre_generico && (
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {producto.nombre_generico}
                      </p>
                    )}
                  </div>

                  {precioVenta && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {precioVenta}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Código interno"
                    value={producto.codigo || '-'}
                  />

                  <InfoItem label="Código de barras" value={codigoBarras} />
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-5">
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6">
                  <svg ref={svgRef} className="max-w-full" />

                  <p className="mt-3 text-center text-base font-semibold tracking-[0.22em] text-slate-800">
                    {codigoBarras}
                  </p>
                </div>

                <p className="mt-3 text-center text-xs text-slate-500">
                  Este código representa el valor guardado en el producto.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="cursor-pointer rounded border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer rounded border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Imprimir
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="cursor-pointer rounded bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Descargar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}