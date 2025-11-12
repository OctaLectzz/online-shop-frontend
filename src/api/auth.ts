import type { Login, Register } from '@/schemas/auth-schema'
import type { ApiResponse } from '@/types'
import type { LoginResponse, RegisterResponse } from '@/types/auth'
import type { User } from '@/types/user'
import server from '@/utils/axios'

export const login = (data: Login): Promise<{ data: LoginResponse }> => {
  return server.post('/auth/login', data)
}

export const register = (data: Register): Promise<{ data: RegisterResponse }> => {
  return server.post('/auth/register', data)
}

export const logout = (): Promise<{ data: { status: string } }> => {
  return server.post('/auth/logout')
}

export const profile = async (): Promise<User> => {
  const response = await server.get<ApiResponse<User>>('/auth/profile')

  return response.data.data
}
