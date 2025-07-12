import { login, register } from '@/api/auth'
import { useAuth as useAuthContext } from '@/context/AuthContext'
import type { Login, Register } from '@/schemas/auth-schema'
import type { APIErrorResponse } from '@/types'
import i18n from '@/utils/i18n'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const { setAuth } = useAuthContext()
  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  return useMutation({
    mutationFn: (data: Login) => login(data),
    onSuccess: (res) => {
      setAuth(res.data)
      navigate('/')
    },
    onError: (err: AxiosError<APIErrorResponse>) => {
      const message = err.response?.data?.message || t('Login gagal')
      console.error('Login error:', message)
    }
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const t = i18n.t.bind(i18n)

  return useMutation({
    mutationFn: (data: Register) => register(data),
    onSuccess: () => navigate('/login'),
    onError: (err: AxiosError<APIErrorResponse>) => {
      const message = err.response?.data?.message || t('Register gagal')
      console.error('Register error:', message)
    }
  })
}
