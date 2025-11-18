import ImagePreview from '@/components/image/image-preview'
import { ImageUpload } from '@/components/image/image-upload'
import LongText from '@/components/long-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/ui/price-input'
import { Switch } from '@/components/ui/switch'
import type { ProductFormValues } from '@/schemas/product-schema'
import { productVariantSchema, type ProductVariantForm } from '@/schemas/product-schema'
import { formatIDR } from '@/utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, type FieldArrayWithId, type UseFieldArrayAppend, type UseFieldArrayRemove, type UseFieldArrayUpdate, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'variants'>[]
  addVariant: UseFieldArrayAppend<ProductFormValues, 'variants'>
  updateVariant: UseFieldArrayUpdate<ProductFormValues, 'variants'>
  removeVariant: UseFieldArrayRemove
}

export function ProductSalesInfoCard({ form, fields, addVariant, updateVariant, removeVariant }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const variantForm = useForm<ProductVariantForm>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      id: undefined,
      name: '',
      price: 0,
      stock: 0,
      image: null
    }
  })

  const useVariant = form.watch('use_variant')
  const variants = form.watch('variants') ?? []

  const resetVariantForm = () => {
    variantForm.reset({
      id: undefined,
      name: '',
      price: 0,
      stock: 0,
      image: null
    })
    setEditIndex(null)
  }

  const handleDialogChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      resetVariantForm()
    }
  }

  const handleAddClick = () => {
    resetVariantForm()
    setOpen(true)
  }

  const handleEditClick = (index: number) => {
    const v = form.getValues(`variants.${index}`)
    variantForm.reset({
      id: v?.id,
      name: v?.name ?? '',
      price: v?.price ?? 0,
      stock: v?.stock ?? 0,
      image: null
    })
    setEditIndex(index)
    setOpen(true)
  }

  const handleToggleVariantMode = (value: boolean) => {
    form.setValue('use_variant', value, { shouldDirty: true })

    const current = form.getValues('variants') ?? []

    if (!value) {
      // SINGLE MODE
      if (current.length === 0) {
        form.setValue(
          'variants',
          [
            {
              id: undefined,
              name: 'no_variant',
              price: 0,
              stock: 0,
              image: null
            }
          ],
          { shouldDirty: true }
        )
      } else {
        form.setValue(
          'variants',
          [
            {
              ...current[0],
              name: current[0].name || 'no_variant'
            }
          ],
          { shouldDirty: true }
        )
      }
    } else {
      if (current.length === 1 && current[0]?.name === 'no_variant') {
        form.setValue('variants', [], { shouldDirty: true })
      }
    }
  }

  const onSubmitVariant = (values: ProductVariantForm) => {
    if (editIndex !== null) {
      const prev = form.getValues(`variants.${editIndex}`)

      updateVariant(editIndex, {
        ...prev,
        id: prev?.id ?? values.id,
        name: values.name.trim(),
        price: values.price,
        stock: values.stock,
        image: values.image ?? prev?.image ?? null
      })
    } else {
      addVariant({
        name: values.name.trim(),
        price: values.price,
        stock: values.stock,
        image: values.image ?? null
      })
    }

    resetVariantForm()
    setOpen(false)
  }

  return (
    <>
      <Card>
        <FormField
          control={form.control}
          name="use_variant"
          render={() => (
            <FormItem>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="font-bold">{t('dashboard.product.salesInformation')}</CardTitle>

                <div className="flex items-center gap-2 space-y-0">
                  <span className="text-muted-foreground text-xs">{useVariant ? t('dashboard.product.variantModeMultiple') : t('dashboard.product.variantModeSingle')}</span>
                  <FormControl>
                    <Switch checked={useVariant} onCheckedChange={handleToggleVariantMode} />
                  </FormControl>
                </div>
              </CardHeader>

              <CardContent className="w-full space-y-4 py-2">
                {/* Single mode (no variant) */}
                {!useVariant && (
                  <div className="space-y-6 py-3">
                    {/* Name hidden, always 'no_variant' */}
                    <FormField
                      control={form.control}
                      name="variants.0.name"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} value="no_variant" readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="variants.0.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="gap-1">
                            {t('dashboard.product.price')}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <PriceInput value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Stock */}
                    <FormField
                      control={form.control}
                      name="variants.0.stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="gap-1">
                            {t('dashboard.product.stock')}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Multiple variant mode */}
                {useVariant && (
                  <>
                    <div className="space-y-2">
                      {fields.length === 0 && (
                        <div className="flex items-center justify-center gap-4 rounded-md border p-3">
                          <div className="text-muted-foreground text-center text-xs">{t('dashboard.product.variantEmpty')}</div>
                        </div>
                      )}

                      {fields.map((field, index) => {
                        const v = variants[index]

                        let imageSrc: string | undefined
                        if (typeof v?.image === 'string') {
                          imageSrc = v.image
                        } else if (v?.image instanceof File) {
                          imageSrc = URL.createObjectURL(v.image)
                        }

                        return (
                          <div key={field.id} className="flex items-center justify-between gap-4 rounded-md border p-3">
                            <div className="flex flex-1 items-center gap-3">
                              <ImagePreview src={imageSrc} alt={v?.name ?? 'Variant'} initials={v?.name || 'V'} className="h-10 w-10" />

                              <div className="space-y-0.5">
                                <LongText className="text-sm leading-none font-medium">{v?.name || t('dashboard.product.unnamedVariant')}</LongText>
                                <p className="text-muted-foreground text-xs">{formatIDR(v?.price ?? 0)}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-muted-foreground text-xs">{t('dashboard.product.stock')}</p>
                              <p className="font-medium">{v?.stock ?? 0}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted h-7 w-7 p-1" onClick={() => handleEditClick(index)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>

                              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 p-1 text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => removeVariant(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add variant button */}
                    <Button type="button" variant="outline" size="sm" onClick={handleAddClick}>
                      + {t('dashboard.product.addVariant')}
                    </Button>

                    <FormField
                      control={form.control}
                      name="variants"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length === 0 && <p className="text-xs text-red-400">{t('dashboard.product.validate.variantMinOne')}</p>}
                  </>
                )}
              </CardContent>
            </FormItem>
          )}
        />
      </Card>

      {/* Add / Edit Variant Dialog */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? (t('dashboard.product.editVariantTitle') ?? t('dashboard.product.addVariantTitle')) : t('dashboard.product.addVariantTitle')}</DialogTitle>
            <DialogDescription>{editIndex !== null ? (t('dashboard.product.editVariantDesc') ?? t('dashboard.product.addVariantDesc')) : t('dashboard.product.addVariantDesc')}</DialogDescription>
          </DialogHeader>

          <Form {...variantForm}>
            <div className="space-y-4">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_2fr]">
                {/* Image */}
                <FormField
                  control={variantForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <ImageUpload value={field.value ?? null} onChange={(file) => field.onChange(file)} currentImage={undefined} shape="square" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 py-2">
                  {/* Variant Name */}
                  <FormField
                    control={variantForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="gap-1">
                          {t('dashboard.product.variantName')}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Red / 64GB / Dual SIM" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Variant Price */}
                  <FormField
                    control={variantForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="gap-1">
                          {t('dashboard.product.price')}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PriceInput value={field.value || 0} onChange={(val) => field.onChange(val)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Variant Stock */}
                  <FormField
                    control={variantForm.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="gap-1">
                          {t('dashboard.product.stock')}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  {t('public.cancelText')}
                </Button>
                <Button type="button" onClick={variantForm.handleSubmit(onSubmitVariant)}>
                  {t('public.saveText')}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
