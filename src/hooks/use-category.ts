import type { CategoryFormValues } from '@/schemas/category-schema'
import type { APIErrorResponse } from '@/types'
import type { Category } from '@/types/category'
import i18n from '@/utils/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { createCategory, deleteCategory, getCategories, showCategory, updateCategory } from '../api/category'

const t = i18n.t.bind(i18n)

export const useCategories = () => {
  return useQuery<Category[], AxiosError>({
    queryKey: ['categories'],
    queryFn: getCategories
  })
}

export const useCategory = (id: number) => {
  return useQuery<Category, AxiosError>({
    queryKey: ['categories', id],
    queryFn: () => showCategory(id),
    enabled: !!id
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<Category, AxiosError<APIErrorResponse>, CategoryFormValues>({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success(t('dashboard.category.response.successCreateMsg'))
      queryClient.invalidateQueries({
        queryKey: ['categories'],
        refetchType: 'active'
      })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.category.response.failedCreateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.category.response.failedCreateMsg'))
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<Category, AxiosError<APIErrorResponse>, CategoryFormValues & { id: number }>({
    mutationFn: updateCategory,
    onSuccess: (_, variables) => {
      toast.success(t('dashboard.category.response.successUpdateMsg'))
      Promise.all([queryClient.invalidateQueries({ queryKey: ['categories'] }), queryClient.invalidateQueries({ queryKey: ['categories', variables.id] })])
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.category.response.failedUpdateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.category.response.failedUpdateMsg'))
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      toast.success(t('dashboard.category.response.successDeleteMsg'))
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.category.response.failedDeleteMsg'))
      toast.error(t('dashboard.category.response.failedDeleteMsg'))
    }
  })
}
