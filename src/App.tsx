import { Toast } from '@/components/ui/toast'
import { Outlet } from 'react-router-dom'

// Providers
import { AuthProvider } from '@/context/auth-context'
import { SearchProvider } from '@/context/search-context'

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Toast />

        <Outlet />
      </SearchProvider>
    </AuthProvider>
  )
}
