// Layouts
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Index from '@/pages/dashboard/Index'

import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  // Auth
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Dashboard
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [{ path: '', element: <Index /> }]
  }
])
