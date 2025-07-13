import { login, logout, profile, register } from '@/api/auth'
import { useAuth as useAuthContext } from '@/context/auth-context'
import type { Login, Register } from '@/schemas/auth-schema'
import type { APIErrorResponse } from '@/types'
import i18n from '@/utils/i18n'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const useRegister = () => {
  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  return useMutation({
    mutationFn: (data: Register) => register(data),
    onSuccess: () => {
      toast.success(t('auth.response.successRegisterMsg'))
      navigate('/login')
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('auth.response.failedRegisterMsg'))
      toast.error(t('auth.response.failedRegisterMsg'))
    }
  })
}

export const useLogin = () => {
  const { setAuth } = useAuthContext()
  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  return useMutation({
    mutationFn: (data: Login) => login(data),
    onSuccess: (res) => {
      setAuth(res.data)
      toast.success(t('auth.response.successLoginMsg'))
      navigate('/dashboard')
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('auth.response.failedLoginMsg'))
      toast.error(t('auth.response.failedLoginMsg'))
    }
  })
}

export const useLogout = () => {
  const { logout: contextLogout } = useAuthContext()
  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      contextLogout()
      toast.success(t('auth.response.successLogoutMsg'))
      navigate('/')
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      console.error(err.response?.data?.message || t('auth.response.failedLogoutMsg'))
      toast.error(t('auth.response.failedLogoutMsg'))
    }
  })
}

export const useProfile = (enabled: boolean) => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: profile,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false
  })
}
