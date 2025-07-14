import { userListSchema, type User } from './schema'

const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Sarah']
const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones']
const statuses = ['active', 'inactive', 'invited', 'suspended'] as const
const roles = ['superadmin', 'admin', 'cashier', 'manager'] as const

const generateMockUser = (index: number): User => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase().slice(0, 3)}${index}`

  return {
    id: `user-${1000 + index}`,
    firstName,
    lastName,
    username,
    email: `${username}@example.com`,
    phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
  }
}

export const generateUsers = (count: number) => {
  const users = Array.from({ length: count }, (_, i) => generateMockUser(i))
  return userListSchema.parse(users) // Validate with Zod schema
}

export const users = generateUsers(20)
