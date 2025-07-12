import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> }
  // { path: '/', element: <div>Home (authenticated)</div> }
])
