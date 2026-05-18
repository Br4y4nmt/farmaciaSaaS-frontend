import { Toaster } from 'sonner'

export function AppSonner() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      duration={3000}
    />
  )
}