import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useCreateProduct, useProduct, useUpdateProduct } from '@/hooks/use-product'
import { productCreateSchema, productUpdateSchema, type ProductFormValues } from '@/schemas/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductAttributesCard } from '@/components/product-form/attributes-card'
import { ProductBasicInfoCard } from '@/components/product-form/basic-info-card'
import { ProductInformationsCard } from '@/components/product-form/informations-card'
import { ProductMediaCard } from '@/components/product-form/media-card'
import { ProductSalesInfoCard } from '@/components/product-form/sales-info-card'
import { ProductSettingsCard } from '@/components/product-form/settings-card'
import { ProductTagsCard } from '@/components/product-form/tags-card'

export function ProductForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const isEdit = !!slug

  const { data: product, isLoading } = useProduct(isEdit ? slug! : '')

  const schema = isEdit ? productUpdateSchema : productCreateSchema
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const isSubmitting = isCreating || isUpdating

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category_id: 0,
      slug: '',
      sku: '',
      name: '',
      description: '',
      dimensions: {
        weight: 0,
        height: null,
        width: null,
        length: null
      },
      status: true,
      use_variant: false,
      images: [],
      keep_images: [],
      variants: [],
      attributes: [],
      informations: [],
      tags: []
    }
  })

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant
  } = useFieldArray({
    control: form.control,
    name: 'variants'
  })

  const {
    fields: attributeFields,
    append: addAttribute,
    remove: removeAttribute
  } = useFieldArray({
    control: form.control,
    name: 'attributes'
  })

  const {
    fields: infoFields,
    append: addInfo,
    remove: removeInfo
  } = useFieldArray({
    control: form.control,
    name: 'informations'
  })

  useEffect(() => {
    if (product && isEdit) {
      form.reset({
        category_id: product.category_id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        description: product.description,
        dimensions: {
          weight: product.dimensions.weight ?? null,
          height: product.dimensions.height ?? null,
          width: product.dimensions.width ?? null,
          length: product.dimensions.length ?? null
        },
        status: Boolean(product.status),
        use_variant: product.use_variant,
        images: undefined,
        keep_images: product.images ?? [],
        variants: product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          stock: v.stock,
          image: null,
          _delete: false
        })),
        attributes: product.attributes.map((a) => ({
          id: a.id,
          name: a.name,
          lists: a.lists,
          _delete: false
        })),
        informations: product.informations.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          _delete: false
        })),
        tags: product.tags
      })
    }
  }, [product, isEdit, form])

  const onSubmit = (values: ProductFormValues) => {
    if (isEdit && product) {
      updateProduct(
        { ...values, slug: product.slug },
        {
          onSuccess: () => navigate('/product')
        }
      )
    } else {
      createProduct(values, {
        onSuccess: () => navigate('/product')
      })
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{t('public.loadingText')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? t('public.editText') : t('public.createText')} {t('dashboard.product.title')}
          </h1>
          <p className="text-muted-foreground text-xs">{isEdit ? t('dashboard.product.editDesc') : t('dashboard.product.createDesc')}</p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          {t('public.backText')}
        </Button>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <ProductMediaCard form={form} product={product} isEdit={isEdit} />

            <ProductBasicInfoCard form={form} />

            <ProductSettingsCard form={form} />
          </div>

          <div className="space-y-6">
            <ProductSalesInfoCard form={form} fields={variantFields} addVariant={addVariant} removeVariant={removeVariant} />

            <ProductAttributesCard form={form} fields={attributeFields} addAttribute={addAttribute} removeAttribute={removeAttribute} />

            <ProductInformationsCard form={form} fields={infoFields} addInfo={addInfo} removeInfo={removeInfo} />

            <ProductTagsCard form={form} />

            <Card>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('public.loadingText') : t('public.saveText')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  )
}
