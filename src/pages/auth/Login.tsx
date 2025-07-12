// src/pages/auth/LoginPage.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { type Login, loginSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: Login) => {
    setFormError('')
    login(data, {
      onError: (err) => {
        const msg = err.response?.data?.message || 'Login gagal'
        setFormError(msg)
      }
    })
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-background">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              {isPending ? t('public.loadingText') : t('auth.loginBtn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
