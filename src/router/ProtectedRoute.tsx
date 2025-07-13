import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'

export default function ProtectedRoute() {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
