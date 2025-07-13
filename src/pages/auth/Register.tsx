import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/use-auth'
import { type Register, registerSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { mutate: registerUser, isPending } = useRegister()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Register>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: Register) => {
    setFormError('')
    registerUser(data, {
      onError: (err) => {
        const apiErrors = err.response?.data?.errors
        const msg = err.response?.data?.message || 'Registrasi gagal'
        if (apiErrors) {
          Object.entries(apiErrors).forEach(([field, messages]) => {
            setError(field as keyof Register, { message: messages.join(', ') })
          })
        } else {
          setFormError(msg)
        }
      }
    })
  }

  return (
    <div className="dark:bg-background flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-[500px] shadow-lg">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="username">{t('auth.username')}</Label>
                <Input id="username" {...register('username')} />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone_number">{t('auth.phoneNumber')}</Label>
              <Input id="phone_number" {...register('phone_number')} />
              {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              {isPending ? t('public.loadingText') : t('auth.registerBtn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
