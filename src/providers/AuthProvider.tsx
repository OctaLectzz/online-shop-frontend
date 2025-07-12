import { AuthContext } from '@/context/AuthContext'
import type { LoginResponse } from '@/types'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  const setAuth = (data: LoginResponse) => {
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return <AuthContext.Provider value={{ user, token, setAuth, logout }}>{children}</AuthContext.Provider>
}
