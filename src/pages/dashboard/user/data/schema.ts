import { z } from 'zod'

// Status Schema
const userStatusSchema = z.union([z.literal('active'), z.literal('inactive'), z.literal('invited'), z.literal('suspended')])
export type UserStatus = z.infer<typeof userStatusSchema>

// Role Schema
const userRoleSchema = z.union([z.literal('superadmin'), z.literal('admin'), z.literal('cashier'), z.literal('manager')])
export type UserRole = z.infer<typeof userRoleSchema>

// User Schema
const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})
export type User = z.infer<typeof userSchema>

// User List Schema
export const userListSchema = z.array(userSchema)
