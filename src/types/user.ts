export interface User {
  id: number
  avatar: File | null
  name: string
  username: string
  email: string
  phone_number: string | null
  status: boolean | number
  created_at: string
  updated_at: string
}
