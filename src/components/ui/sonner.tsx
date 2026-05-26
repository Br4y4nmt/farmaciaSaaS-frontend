import { Toaster, toast } from 'sonner'

export function AppSonner() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand
      duration={3000}
    />
  )
}

// Reusable helpers
export function showToast(message: string) {
  toast(message)
}

export function showSuccess(message: string) {
  toast.success(message)
}

export function showInfo(message: string) {
  toast.info(message)
}

export function showWarning(message: string) {
  toast.warning(message)
}

export function showError(message: string) {
  toast.error(message)
}

export function showPromise<T>(promise: () => Promise<T>, messages: { loading: string; success: (data: T) => string; error: string }) {
  return toast.promise<T>(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  })
}

// Optional small demo component (can be used for testing)
export function SonnerExamples() {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => showToast('Default')} className="rounded border px-3 py-1">Default</button>
      <button onClick={() => showSuccess('Creado con éxito')} className="rounded border px-3 py-1">Success</button>
      <button onClick={() => showInfo('Información')} className="rounded border px-3 py-1">Info</button>
      <button onClick={() => showWarning('Atención')} className="rounded border px-3 py-1">Warning</button>
      <button onClick={() => showError('Error ocurrido')} className="rounded border px-3 py-1">Error</button>
    </div>
  )
}