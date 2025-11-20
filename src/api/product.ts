import type { ProductFormValues } from '@/schemas/product-schema'
import type { Product } from '@/types/product'
import server from '@/utils/axios'
import { objectToFormData } from '@/utils/form-data'

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await server.get('/product')

  return data.data
}

export const showProduct = async (slug: string): Promise<Product> => {
  const { data } = await server.get(`/product/${slug}`)

  return data.data
}

export const createProduct = async (values: ProductFormValues): Promise<Product> => {
  const formData = objectToFormData({
    ...values,
    status: values.status === false ? 0 : 1,
    use_variant: values.use_variant === false ? 0 : 1
  })

  const { data } = await server.post<{ data: Product }>('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data.data
}

export const updateProduct = async (values: ProductFormValues & { slug: string }): Promise<Product> => {
  if (!values.slug) {
    throw new Error('ID is required for updates')
  }

  const formData = objectToFormData({
    ...values,
    status: values.status ? 1 : 0,
    use_variant: values.use_variant ? 1 : 0,

    keep_images: values.keep_images ?? [],
    images: (values.images ?? []).filter((f) => f instanceof File) as File[],

    variants: (values.variants ?? []).map((variant) => ({
      ...variant,
      id: variant.id ?? null,
      _delete: variant._delete ? 1 : 0,
      image: variant.image instanceof File ? variant.image : null
    })),

    attributes: (values.attributes ?? []).map((attribute) => ({
      ...attribute,
      id: attribute.id ?? null,
      _delete: attribute._delete ? 1 : 0
    })),

    informations: (values.informations ?? []).map((information) => ({
      ...information,
      id: information.id ?? null,
      _delete: information._delete ? 1 : 0
    })),

    tags: (values.tags ?? []).filter((t) => !!t)
  })

  const { data } = await server.post<{ data: Product }>(`/product/${values.slug}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data.data
}

export const deleteProduct = async (slug: string): Promise<void> => {
  await server.delete(`${'/product'}/${slug}`)
}
