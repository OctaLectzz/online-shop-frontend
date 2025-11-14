import type { ProductFormValues } from '@/schemas/product-schema'
import type { APIErrorResponse } from '@/types'
import type { Product } from '@/types/product'
import i18n from '@/utils/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { createProduct, deleteProduct, getProducts, showProduct, updateProduct } from '../api/product'

const t = i18n.t.bind(i18n)

export const useProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ['products'],
    queryFn: getProducts
  })
}

export const useProduct = (slug: string) => {
  return useQuery<Product, AxiosError>({
    queryKey: ['products', slug],
    queryFn: () => showProduct(slug),
    enabled: !!slug
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<Product, AxiosError<APIErrorResponse>, ProductFormValues>({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success(t('dashboard.product.response.successCreateMsg'))
      queryClient.invalidateQueries({
        queryKey: ['products'],
        refetchType: 'active'
      })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.product.response.failedCreateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.product.response.failedCreateMsg'))
    }
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation<Product, AxiosError<APIErrorResponse>, ProductFormValues & { slug: string }>({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      toast.success(t('dashboard.product.response.successUpdateMsg'))
      Promise.all([queryClient.invalidateQueries({ queryKey: ['products'] }), queryClient.invalidateQueries({ queryKey: ['products', variables.slug] })])
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.product.response.failedUpdateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.product.response.failedUpdateMsg'))
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteProduct(slug),
    onSuccess: () => {
      toast.success(t('dashboard.product.response.successDeleteMsg'))
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.product.response.failedDeleteMsg'))
      toast.error(t('dashboard.product.response.failedDeleteMsg'))
    }
  })
}
