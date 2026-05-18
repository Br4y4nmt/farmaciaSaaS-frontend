import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes/AppRoutes'
import { AppSonner } from './components/ui/sonner'

function App() {
  return (
    <BrowserRouter>

      <AppSonner />

      <AppRoutes />

    </BrowserRouter>
  )
}

export default App