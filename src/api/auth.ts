import type { Login, Register } from '@/schemas/auth-schema'
import type { LoginResponse, RegisterResponse } from '@/types'
import server from '@/utils/axios'

export const login = (data: Login): Promise<{ data: LoginResponse }> => {
  return server.post('/auth/login', data)
}

export const register = (data: Register): Promise<{ data: RegisterResponse }> => {
  return server.post('/auth/register', data)
}
