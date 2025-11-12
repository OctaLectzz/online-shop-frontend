import { useProfile } from '@/hooks/use-auth'
import type { LoginResponse } from '@/types/auth'
import i18n from '@/utils/i18n'
import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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

  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  const { data, isSuccess, isError } = useProfile(!!token && !user)

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError && token) {
      logout()
      toast.error(t('auth.response.sessionExpiredMsg'))
      navigate('/')
    }
  }, [isError, token, navigate, t])

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
