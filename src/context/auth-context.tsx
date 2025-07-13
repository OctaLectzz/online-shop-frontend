import { useProfile } from '@/hooks/use-auth'
import type { LoginResponse } from '@/types'
import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface AuthContextType {
  user: LoginResponse['user'] | null
  token: string | null
  setAuth: (data: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null)
  const [token, setToken] = useState<string | null>(() => Cookies.get('token') || null)

  const { data, isSuccess } = useProfile(!!token && !user)

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data)
    }
  }, [isSuccess, data])

  const setAuth = (data: LoginResponse) => {
    setUser(data.user)
    setToken(data.token)
    Cookies.set('token', data.token, { expires: 30 })
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove('token')
  }

  return <AuthContext.Provider value={{ user, token, setAuth, logout }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
