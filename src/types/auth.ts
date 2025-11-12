import type { User } from '@/types/user'

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterResponse {
  id: number
  name: string
  username: string
  email: string
  phone_number: string | null
  created_at: string
  updated_at: string
}
