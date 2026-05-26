import Swal from 'sweetalert2'

type AlertOptions = {
  title?: string
  text?: string
  html?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  showCancelButton?: boolean
  allowOutsideClick?: boolean
  width?: string
}

const baseOptions = {
  width: '520px',
  allowOutsideClick: false,
  focusConfirm: true,
}

export const showQuestionAlert = async (
  opts: AlertOptions = {}
): Promise<boolean> => {
  const res = await Swal.fire({
    icon: 'question' as any,
    title: opts.title || '¿Estás seguro?',
    text: opts.text,
    html: opts.html,
    showCancelButton: true,
    confirmButtonText: opts.confirmButtonText || 'Sí',
    cancelButtonText: opts.cancelButtonText || 'No',
    confirmButtonColor: opts.confirmButtonColor || '#1BA3D8',
    cancelButtonColor: opts.cancelButtonColor || '#94A3B8',
    ...baseOptions,
    ...opts,
  })

  return !!res.isConfirmed
}

export const showWarningAlert = async (
  opts: AlertOptions = {}
): Promise<boolean> => {
  const res = await Swal.fire({
    icon: 'warning' as any,
    title: opts.title || 'Advertencia',
    text: opts.text,
    showCancelButton: !!opts.showCancelButton,
    confirmButtonText: opts.confirmButtonText || 'Aceptar',
    cancelButtonText: opts.cancelButtonText || 'Cancelar',
    confirmButtonColor: opts.confirmButtonColor || '#2EBAA1',
    cancelButtonColor: opts.cancelButtonColor || '#011B4B',
    ...baseOptions,
    ...opts,
  })

  return !!res.isConfirmed
}

export const showErrorAlert = async (
  opts: AlertOptions = {}
): Promise<void> => {
  await Swal.fire({
    icon: 'error' as any,
    title: opts.title || 'Error',
    text: opts.text,
    confirmButtonText: opts.confirmButtonText || 'Aceptar',
    ...baseOptions,
    ...opts,
  })
}

export const showInfoAlert = async (
  opts: AlertOptions = {}
): Promise<void> => {
  await Swal.fire({
    icon: 'info' as any,
    title: opts.title || 'Información',
    text: opts.text,
    confirmButtonText: opts.confirmButtonText || 'Aceptar',
    ...baseOptions,
    ...opts,
  })
}

export default {
  showQuestionAlert,
  showWarningAlert,
  showErrorAlert,
  showInfoAlert,
}
