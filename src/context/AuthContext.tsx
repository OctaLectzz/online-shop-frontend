import type { LoginResponse } from '@/types'
import { createContext, useContext } from 'react'

export interface AuthContextType {
  user: LoginResponse['user'] | null
  token: string | null
  setAuth: (data: LoginResponse) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
