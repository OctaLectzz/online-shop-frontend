import App from '@/App'
import { createBrowserRouter } from 'react-router-dom'

// Protected
import ProtectedRoute from '@/router/protected-route'

// Layouts
import AuthLayout from '@/layouts/auth-layout'
import DashboardLayout from '@/layouts/dashboard-layout'

// Pages
import Login from '@/pages/auth/login'
import Register from '@/pages/auth/register'
import Category from '@/pages/dashboard/category'
import Index from '@/pages/dashboard/index'
import User from '@/pages/dashboard/user'

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
              { path: 'user', element: <User /> },
              { path: 'category', element: <Category /> }
            ]
          }
        ]
      }
    ]
  }
])
