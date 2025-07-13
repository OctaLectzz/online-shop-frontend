import App from '@/App'
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Index from '@/pages/dashboard/Index'

// Protected
import ProtectedRoute from '@/router/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Auth
      { index: true, element: <Login /> },
      { path: 'register', element: <Register /> },

      // Dashboard
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <DashboardLayout />,
            children: [{ index: true, element: <Index /> }]
          }
        ]
      }
    ]
  }
])
