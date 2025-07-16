import type { UserForm } from '@/schemas/user-schema'
import type { User } from '@/types'
import server from '@/utils/axios'
import { objectToFormData } from '@/utils/form-data'

export const getUsers = async (): Promise<User[]> => {
  const { data } = await server.get('/user')

  return data.data
}

export const showUser = async (id: number): Promise<User> => {
  const { data } = await server.get(`/user/${id}`)

  return data.data
}

export const createUser = async (values: UserForm): Promise<User> => {
  const formData = objectToFormData({
    ...values,
    avatar: values.avatar instanceof File ? values.avatar : null,
    status: values.status === false ? 0 : 1
  })
  if (!values.password) {
    formData.delete('password')
    formData.delete('confirmPassword')
  }

  const { data } = await server.post<{ data: User }>('/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data.data
}

export const updateUser = async (values: UserForm & { id: number }): Promise<User> => {
  if (!values.id) {
    throw new Error('ID is required for updates')
  }

  const payload = {
    ...values,
    avatar: values.avatar instanceof File ? values.avatar : undefined,
    status: values.status === false ? 0 : 1,
    ...(!values.password
      ? {
          password: undefined,
          confirmPassword: undefined
        }
      : {})
  }

  const formData = objectToFormData(payload)

  const { data } = await server.put<{ data: User }>(`/user/${values.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await server.delete(`${'/user'}/${id}`)
}
