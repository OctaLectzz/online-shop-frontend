import i18n from '@/utils/i18n'
import { z } from 'zod'

const t = i18n.t.bind(i18n)

export const userSchema = z
  .object({
    avatar: z.instanceof(File).optional().nullable(),
    name: z
      .string()
      .min(1, { message: t('dashboard.user.validate.nameRequired') })
      .max(50, { message: t('dashboard.user.validate.nameMaxLength') }),
    username: z
      .string()
      .min(1, { message: t('dashboard.user.validate.usernameRequired') })
      .max(20, { message: t('dashboard.user.validate.usernameMaxLength') }),
    email: z.string().email({ message: t('dashboard.user.validate.emailFormat') }),
    password: z
      .string()
      .min(8, { message: t('dashboard.user.validate.passwordMinLength') })
      .optional()
      .nullable(),
    confirmPassword: z.string().optional().nullable(),
    phone_number: z
      .string()
      .max(15, { message: t('dashboard.user.validate.phoneNumberMaxLength') })
      .optional()
      .nullable(),
    status: z.boolean(),
    isEdit: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('dashboard.user.validate.confirmPasswordNotMatch'),
    path: ['confirmPassword']
  })

export const userCreateSchema = userSchema
  .extend({
    password: z.string().min(8, { message: t('dashboard.user.validate.passwordMinLength') }),
    confirmPassword: z.string().min(8, { message: t('dashboard.user.validate.passwordMinLength') })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('dashboard.user.validate.confirmPasswordNotMatch'),
        path: ['confirmPassword']
      })
    }
  })

export const userUpdateSchema = userSchema
  .extend({
    password: z.string().optional().nullable(),
    confirmPassword: z.string().optional().nullable()
  })
  .superRefine((data, ctx) => {
    if ((data.password || data.confirmPassword) && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('dashboard.user.validate.confirmPasswordNotMatch'),
        path: ['confirmPassword']
      })
    }
  })

export type UserForm = z.infer<typeof userSchema>
export type UserCreateFormValues = z.infer<typeof userCreateSchema>
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>
