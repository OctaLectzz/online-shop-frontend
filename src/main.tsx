import { Toast } from '@/components/ui/toast'
import { router } from '@/router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// CSS
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

// Providers
import { AuthProvider } from '@/context/auth-context'
import { SearchProvider } from '@/context/search-context'
import { ThemeProvider } from '@/context/theme-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <SearchProvider>
            <Toast />

            <RouterProvider router={router} />
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
