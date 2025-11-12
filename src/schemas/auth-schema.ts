import i18n from '@/utils/i18n'
import { z } from 'zod'

const t = i18n.t.bind(i18n)

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: t('auth.validate.nameRequired') })
      .max(50, { message: t('auth.validate.nameMaxLength') }),
    username: z
      .string()
      .min(1, { message: t('auth.validate.usernameRequired') })
      .max(20, { message: t('auth.validate.usernameMaxLength') }),
    email: z.string().email({ message: t('auth.validate.emailFormat') }),
    password: z.string().min(8, { message: t('auth.validate.passwordMinLength') }),
    confirmPassword: z.string().min(8, { message: t('auth.validate.passwordMinLength') }),
    phone_number: z
      .string()
      .max(15, { message: t('auth.validate.phoneNumberMaxLength') })
      .optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validate.confirmPasswordNotMatch'),
    path: ['confirmPassword']
  })
export const loginSchema = z.object({
  email: z.string().email({ message: t('auth.validate.emailFormat') }),
  password: z.string().min(8, { message: t('auth.validate.passwordMinLength') })
})

export type Register = z.infer<typeof registerSchema>
export type Login = z.infer<typeof loginSchema>
