import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useLogin } from '@/hooks/use-auth'
import { type Login, loginSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Facebook, Github } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const { t } = useTranslation()
  const { mutate: login, isPending } = useLogin()
  const [formError, setFormError] = useState('')

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: Login) => {
    setFormError('')
    login(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">{t('auth.loginTitle')}</CardTitle>
        <CardDescription className="max-w-96">
          {t('auth.loginDescription')}{' '}
          <Link to="/register" className="hover:text-primary underline underline-offset-4">
            {t('auth.registerTitle')}
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                  <Link to="/forgot-password" className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75">
                    {t('auth.forgotPassword')}
                  </Link>
                </FormItem>
              )}
            />

            {/* Error Msg */}
            {formError && <p className="text-destructive text-sm font-medium">{formError}</p>}

            {/* Button */}
            <Button className="mt-2" disabled={isPending}>
              {isPending ? t('public.loadingText') : t('auth.loginBtn')}
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
              <Button variant="outline" type="button" disabled={isPending}>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button variant="outline" type="button" disabled={isPending}>
                <Facebook className="mr-2 h-4 w-4" /> Facebook
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
