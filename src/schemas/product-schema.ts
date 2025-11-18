import i18n from '@/utils/i18n'
import { z } from 'zod'

const t = i18n.t.bind(i18n)

// Variants
export const productVariantSchema = z.object({
  id: z.number().nullable().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.variantNameRequired') })
    .max(255, { message: t('dashboard.product.validate.variantNameMax') }),
  price: z.number().min(0, { message: t('public.validateMin0') }),
  stock: z.number().min(0, { message: t('public.validateMin0') }),
  sold: z.number().nullable().optional(),
  image: z.instanceof(File).nullable().optional()
})

// Attributes
export const productAttributeSchema = z.object({
  id: z.number().nullable().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.attributeNameRequired') })
    .max(255, { message: t('dashboard.product.validate.attributeNameMax') }),
  lists: z.array(z.string().min(1)).min(1, { message: t('dashboard.product.validate.attributeListsMin') })
})

// Informations
export const productInformationSchema = z.object({
  id: z.number().nullable().optional(),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.infoNameRequired') })
    .max(255, { message: t('dashboard.product.validate.infoNameMax') }),
  description: z.string().min(1, { message: t('dashboard.product.validate.infoDescriptionRequired') })
})

// Dimensions
export const productDimensionsSchema = z.object({
  weight: z.number({ message: t('public.validateMin0') }).min(0, { message: t('public.validateMin0') }),
  height: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  length: z.number().optional().nullable()
})

// Base Product schema (form)
export const productSchema = z.object({
  category_id: z.number().min(1, { message: t('dashboard.product.validate.categoryRequired') }),
  sku: z
    .string()
    .min(1, { message: t('dashboard.product.validate.skuRequired') })
    .max(255, { message: t('dashboard.product.validate.skuMax') }),
  name: z
    .string()
    .min(1, { message: t('dashboard.product.validate.nameRequired') })
    .max(255, { message: t('dashboard.product.validate.nameMax') }),
  slug: z
    .string()
    .min(1, { message: t('dashboard.product.validate.slugRequired') })
    .max(255, { message: t('dashboard.product.validate.slugMax') }),
  description: z.string().min(1, { message: t('dashboard.product.validate.descriptionRequired') }),

  // dimensions & status
  dimensions: productDimensionsSchema,
  status: z.boolean(),
  use_variant: z.boolean().default(false),

  // relations (form)
  images: z.array(z.instanceof(File)).default([]),
  keep_images: z.array(z.string()).default([]),
  variants: z.array(productVariantSchema).default([]),
  attributes: z.array(productAttributeSchema).default([]),
  informations: z.array(productInformationSchema).default([]),
  tags: z.array(z.string().optional()).default([])
})

export const productCreateSchema = productSchema

export const productUpdateSchema = productSchema

// Types
export type ProductFormValues = z.input<typeof productSchema>
export type ProductCreateFormValues = z.input<typeof productCreateSchema>
export type ProductUpdateFormValues = z.input<typeof productUpdateSchema>

export type ProductVariantForm = z.infer<typeof productVariantSchema>
export type ProductAttributeForm = z.infer<typeof productAttributeSchema>
export type ProductInformationForm = z.infer<typeof productInformationSchema>
