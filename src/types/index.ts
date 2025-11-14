import type { User } from '@/types/user'

export type Settings = Record<string, string | null>

export interface Log {
  id: number
  user_id: number
  user: User
  action: string
  description: string | null
  reference_type: string
  reference_id: number
  read: boolean
  created_at: string
}

export interface ApiResponse<T> {
  data: T
}

export type APIErrorResponse = {
  message: string
  errors?: Record<string, string[]>
}
