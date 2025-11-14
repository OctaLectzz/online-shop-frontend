import { ImageUpload } from '@/components/image/image-upload'
import LongText from '@/components/long-text'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/ui/price-input'
import { Switch } from '@/components/ui/switch'
import type { ProductFormValues } from '@/schemas/product-schema'
import { formatIDR } from '@/utils/format'
import { getInitials } from '@/utils/get-initials'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'variants'>[]
  addVariant: UseFieldArrayAppend<ProductFormValues, 'variants'>
  removeVariant: UseFieldArrayRemove
}

export function ProductSalesInfoCard({ form, fields, addVariant, removeVariant }: Props) {
  const { t } = useTranslation()
  const useVariant = form.watch('use_variant')
  const variants = form.watch('variants') ?? []
  const [openDialog, setOpenDialog] = useState(false)
  const [newVariant, setNewVariant] = useState<{
    name: string
    price: number
    stock: number
    image: File | null
  }>({
    name: '',
    price: 0,
    stock: 0,
    image: null
  })

  useEffect(() => {
    if (!useVariant) {
      const currentVariants = form.getValues('variants') ?? []
      if (currentVariants.length === 0) {
        form.setValue(
          'variants',
          [
            {
              name: 'no_variant',
              price: 0,
              stock: 0,
              image: null,
              _delete: false
            }
          ],
          { shouldDirty: true }
        )
      } else {
        form.setValue('variants.0.name', currentVariants[0].name || 'no_variant', { shouldDirty: true })
      }
    } else {
      const currentVariants = form.getValues('variants') ?? []
      if (currentVariants.length === 1 && currentVariants[0]?.name === 'no_variant') {
        form.setValue('variants', [], { shouldDirty: true })
      }
    }
  }, [useVariant, form])

  const handleOpenDialog = () => {
    setNewVariant({
      name: '',
      price: 0,
      stock: 0,
      image: null
    })
    setOpenDialog(true)
  }

  const handleSaveNewVariant = () => {
    if (!newVariant.name.trim()) {
      return
    }

    addVariant({
      name: newVariant.name.trim(),
      price: Number(newVariant.price) || 0,
      stock: Number(newVariant.stock) || 0,
      image: newVariant.image,
      _delete: false
    })

    setOpenDialog(false)
  }

  return (
    <>
      <Card>
        <FormField
          control={form.control}
          name="use_variant"
          render={({ field }) => (
            <FormItem>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="font-bold">{t('dashboard.product.salesInformation')}</CardTitle>

                {/* Switch Mode */}
                <div className="flex items-center gap-2 space-y-0">
                  <span className="text-muted-foreground text-xs">{field.value ? t('dashboard.product.variantModeMultiple') : t('dashboard.product.variantModeSingle')}</span>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(val) => field.onChange(val)} />
                  </FormControl>
                </div>
              </CardHeader>

              <CardContent className="w-full space-y-4 py-2">
                {/* No Variant */}
                {!useVariant && (
                  <div className="space-y-6 py-3">
                    {/* Name */}
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

                {/* Use Variant */}
                {useVariant && (
                  <>
                    <div className="space-y-2">
                      {fields.length === 0 && (
                        <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                          <div className="text-muted-foreground text-xs">{t('dashboard.product.variantEmptyHelper')}</div>
                        </div>
                      )}

                      {/* Variants Card */}
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
                              {imageSrc ? (
                                <img src={imageSrc} alt={v?.name ?? 'Variant'} className="h-10 w-10 rounded-md object-cover" />
                              ) : (
                                <Avatar className="h-10 w-10 rounded-md">
                                  <AvatarFallback className="rounded-md">{getInitials(v?.name || 'V')}</AvatarFallback>
                                </Avatar>
                              )}

                              <div className="space-y-0.5">
                                <LongText className="text-sm leading-none font-medium">{v?.name || t('dashboard.product.unnamedVariant')}</LongText>
                                <p className="text-muted-foreground text-xs">{formatIDR(v?.price ?? 0)}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-muted-foreground text-xs">{t('dashboard.product.stock')}</p>
                              <p className="font-medium">{v?.stock ?? 0}</p>
                            </div>

                            <div className="flex items-center">
                              <Button type="button" variant="ghost" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => removeVariant(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <FormField
                      control={form.control}
                      name="variants"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add Variant */}
                    <Button type="button" variant="outline" size="sm" className="mt-1" onClick={handleOpenDialog}>
                      + {t('dashboard.product.addVariant')}
                    </Button>

                    {fields.length === 0 && <p className="text-xs text-red-400">{t('dashboard.product.validate.variantMinOne')}</p>}
                  </>
                )}
              </CardContent>
            </FormItem>
          )}
        />
      </Card>

      {/* Add Variant Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.product.addVariantTitle')}</DialogTitle>
            <DialogDescription>{t('dashboard.product.addVariantDesc')}</DialogDescription>
          </DialogHeader>

          <div className="grid items-center gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Image */}
            <div className="flex justify-center">
              <ImageUpload value={newVariant.image ?? null} onChange={(file) => setNewVariant((v) => ({ ...v, image: file }))} currentImage={typeof newVariant?.image === 'string' ? newVariant.image : undefined} shape="square" />
            </div>

            <div className="space-y-4 py-2">
              {/* Name */}
              <div className="space-y-1">
                <FormLabel className="gap-1">
                  {t('dashboard.product.variantName')}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Input value={newVariant.name} onChange={(e) => setNewVariant((v) => ({ ...v, name: e.target.value }))} placeholder="Red / 64GB / Dual SIM" />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <FormLabel className="gap-1">
                  {t('dashboard.product.price')}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <PriceInput value={Number(newVariant.price) || 0} onChange={(val) => setNewVariant((v) => ({ ...v, price: val }))} />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <FormLabel className="gap-1">
                  {t('dashboard.product.stock')}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Input type="number" value={newVariant.stock} onChange={(e) => setNewVariant((v) => ({ ...v, stock: Number(e.target.value) }))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
              {t('public.cancelText')}
            </Button>
            <Button type="button" onClick={handleSaveNewVariant}>
              {t('public.saveText')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
