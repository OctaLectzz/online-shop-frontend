import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useRegister } from '@/hooks/use-auth'
import { type Register, registerSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Facebook, Github } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { mutate: register, isPending } = useRegister()
  const [formError, setFormError] = useState('')

  const form = useForm<Register>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = (data: Register) => {
    setFormError('')
    register(data)
  }

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">{t('auth.registerTitle')}</CardTitle>
        <CardDescription className="max-w-96">
          {t('auth.registerDescription')}{' '}
          <Link to="/login" className="hover:text-primary underline underline-offset-4">
            {t('auth.loginTitle')}
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Error Msg */}
            {formError && <p className="text-destructive text-sm font-medium">{formError}</p>}

            <Button className="mt-2" disabled={isPending}>
              {isPending ? t('public.loadingText') : t('auth.registerBtn')}
            </Button>

            {/* Or Continue With */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">{t('auth.orContinueWith')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                <Github className="h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                <Facebook className="h-4 w-4" /> Facebook
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Terms & Service */}
      <CardFooter>
        <p className="text-muted-foreground px-8 text-center text-sm">
          {t('auth.termsPrefix')}{' '}
          <Link to="/terms" className="hover:text-primary underline underline-offset-4">
            {t('auth.terms')}{' '}
          </Link>
          {t('auth.and')}{' '}
          <Link to="/privacy" className="hover:text-primary underline underline-offset-4">
            {t('auth.privacyPolicy')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
