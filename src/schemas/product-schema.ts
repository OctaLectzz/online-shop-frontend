import i18n from '@/utils/i18n'
import { z } from 'zod'

const t = i18n.t.bind(i18n)

/** Variants */
export const productVariantSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.variantNameRequired') })
    .max(255, { message: t('dashboard.product.validate.variantNameMax') }),
  price: z.number().min(0, { message: t('public.validateMin0') }),
  stock: z.number().min(0, { message: t('public.validateMin0') }),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
  _delete: z.boolean().optional()
})

/** Attributes */
export const productAttributeSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.attributeNameRequired') })
    .max(255, { message: t('dashboard.product.validate.attributeNameMax') }),
  lists: z.array(z.string().min(1)).min(1, { message: t('dashboard.product.validate.attributeListsMin') }),
  _delete: z.boolean().optional()
})

/** Informations */
export const productInformationSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.infoNameRequired') })
    .max(255, { message: t('dashboard.product.validate.infoNameMax') }),
  description: z.string().min(1, { message: t('dashboard.product.validate.infoDescriptionRequired') }),
  _delete: z.boolean().optional()
})

/** Dimensions */
export const productDimensionsSchema = z.object({
  weight: z.number({ message: t('public.validateMin0') }).min(0, { message: t('public.validateMin0') }),
  height: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  length: z.number().optional().nullable()
})

/** Base Product schema (form) */
export const productSchema = z.object({
  category_id: z.number().min(1, { message: t('dashboard.product.validate.categoryRequired') }),
  slug: z.string().optional(),
  sku: z
    .string()
    .min(1, { message: t('dashboard.product.validate.skuRequired') })
    .max(255, { message: t('dashboard.product.validate.skuMax') }),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.nameRequired') })
    .max(255, { message: t('dashboard.product.validate.nameMax') }),
  description: z.string().min(1, { message: t('dashboard.product.validate.descriptionRequired') }),

  // dimensions & status
  dimensions: productDimensionsSchema,
  status: z.boolean(),

  // relations (form)
  images: z.array(z.instanceof(File)).optional().nullable(),
  keep_images: z.array(z.string()).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
  attributes: z.array(productAttributeSchema).optional().default([]),
  informations: z.array(productInformationSchema).optional().default([]),
  tags: z.array(z.string().min(1)).optional().default([]),

  use_variant: z.boolean().default(false)
})

export const productCreateSchema = productSchema.extend({})

export const productUpdateSchema = productSchema.extend({})

/** Types */
export type ProductFormValues = z.input<typeof productSchema>
export type ProductCreateFormValues = z.infer<typeof productCreateSchema>
export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>

export type ProductVariantForm = z.infer<typeof productVariantSchema>
export type ProductAttributeForm = z.infer<typeof productAttributeSchema>
export type ProductInformationForm = z.infer<typeof productInformationSchema>
