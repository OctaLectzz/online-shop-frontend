export interface LoginResponse {
  token: string
  user: {
    id: number
    avatar: string | null
    name: string
    username: string
    email: string
    email_verified_at: string | null
    phone_number: string
    status: number
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
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

export type APIErrorResponse = {
  message: string
  errors?: Record<string, string[]>
}
