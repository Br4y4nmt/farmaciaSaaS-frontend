import Swal from 'sweetalert2'
import { useEffect } from 'react'

const createToast = (
  position = 'top-end',
  icon = 'success',
  timer = 4000
) =>
  Swal.mixin({
    toast: true,
    width: '350px',
    position: position as any,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon: icon as any,

    customClass: {
      popup: 'swal2-toast-custom',
    },

    didOpen: (toast) => {
      toast.addEventListener(
        'mouseenter',
        Swal.stopTimer
      )

      toast.addEventListener(
        'mouseleave',
        Swal.resumeTimer
      )
    },
  })

export const showSuccessToast = (
  title: string,
  text = ''
) => {
  createToast(
    'top-end',
    'success'
  ).fire({
    title,
    text,
  })
}

export const showWarningToast = (
  title: string,
  text = ''
) => {
  createToast(
    'top-end',
    'warning'
  ).fire({
    title,
    text,
  })
}

export const showErrorToast = (
  title: string,
  text = ''
) => {
  createToast(
    'top-end',
    'error'
  ).fire({
    title,
    text,
  })
}

export const useWelcomeToast = (
  flagKey = 'showBienvenida',
  nameKey = 'nombre_usuario'
) => {
  useEffect(() => {
    const mostrarBienvenida =
      localStorage.getItem(flagKey)

    const nombre =
      localStorage.getItem(nameKey)

    if (mostrarBienvenida === 'true') {
      createToast(
        'bottom-end',
        'success',
        6000
      ).fire({
        title: `Bienvenido ${nombre || ''}`,
      })

      localStorage.removeItem(flagKey)
    }
  }, [flagKey, nameKey])
}