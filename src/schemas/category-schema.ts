import i18n from '@/utils/i18n'
import { z } from 'zod'

const t = i18n.t.bind(i18n)

export const categorySchema = z.object({
  image: z.instanceof(File).optional().nullable(),
  name: z
    .string()
    .min(1, { message: t('dashboard.category.validate.nameRequired') })
    .max(50, { message: t('dashboard.category.validate.nameMax') }),
  description: z.string().optional().nullable(),
  isEdit: z.boolean()
})

export const categoryCreateSchema = categorySchema

export const categoryUpdateSchema = categorySchema

export type CategoryValues = z.infer<typeof categorySchema>
export type CategoryCreateFormValues = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateFormValues = z.infer<typeof categoryUpdateSchema>
