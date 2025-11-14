import type { UserFormValues } from '@/schemas/user-schema'
import type { APIErrorResponse } from '@/types'
import type { User } from '@/types/user'
import i18n from '@/utils/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { createUser, deleteUser, getUsers, showUser, updateUser } from '../api/user'

const t = i18n.t.bind(i18n)

export const useUsers = () => {
  return useQuery<User[], AxiosError>({
    queryKey: ['users'],
    queryFn: getUsers
  })
}

export const useUser = (id: number) => {
  return useQuery<User, AxiosError>({
    queryKey: ['users', id],
    queryFn: () => showUser(id),
    enabled: !!id
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError<APIErrorResponse>, UserFormValues>({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success(t('dashboard.user.response.successCreateMsg'))
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active'
      })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.user.response.failedCreateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.user.response.failedCreateMsg'))
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<User, AxiosError<APIErrorResponse>, UserFormValues & { id: number }>({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      toast.success(t('dashboard.user.response.successUpdateMsg'))
      Promise.all([queryClient.invalidateQueries({ queryKey: ['users'] }), queryClient.invalidateQueries({ queryKey: ['users', variables.id] })])
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.user.response.failedUpdateMsg'))
      toast.error(err.response?.data?.message || t('dashboard.user.response.failedUpdateMsg'))
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success(t('dashboard.user.response.successDeleteMsg'))
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('dashboard.user.response.failedDeleteMsg'))
      toast.error(t('dashboard.user.response.failedDeleteMsg'))
    }
  })
}
