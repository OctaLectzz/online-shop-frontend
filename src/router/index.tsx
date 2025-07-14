import App from '@/App'
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import AuthLayout from '@/layouts/auth-layout'
import DashboardLayout from '@/layouts/dashboard-layout'

// Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Index from '@/pages/dashboard/Index'
import User from '@/pages/dashboard/user'

// Protected
import ProtectedRoute from '@/router/protected-route'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Auth
      {
        path: '',
        element: <AuthLayout />,
        children: [
          { path: '', element: <Login /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> }
        ]
      },

      // Dashboard
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <Index /> },
              { path: 'user', element: <User /> }
            ]
          }
        ]
      }
    ]
  }
])
