import type { CategoryFormValues } from '@/schemas/category-schema'
import type { Category } from '@/types/category'
import server from '@/utils/axios'
import { objectToFormData } from '@/utils/form-data'

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await server.get('/category')

  return data.data
}

export const showCategory = async (id: number): Promise<Category> => {
  const { data } = await server.get(`/category/${id}`)

  return data.data
}

export const createCategory = async (values: CategoryFormValues): Promise<Category> => {
  const formData = objectToFormData(values)

  const { data } = await server.post<{ data: Category }>('/category', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data.data
}

export const updateCategory = async (values: CategoryFormValues & { id: number }): Promise<Category> => {
  if (!values.id) {
    throw new Error('ID is required for updates')
  }

  const formData = objectToFormData(values)

  const { data } = await server.put<{ data: Category }>(`/category/${values.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await server.delete(`${'/category'}/${id}`)
}
