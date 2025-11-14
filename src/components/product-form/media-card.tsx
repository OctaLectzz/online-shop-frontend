import { MultiImageUpload } from '@/components/image/multi-image-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { ProductFormValues } from '@/schemas/product-schema'
import type { Product } from '@/types/product'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface MediaProps {
  form: UseFormReturn<ProductFormValues>
  product?: Product
  isEdit: boolean
}

export function ProductMediaCard({ form, product, isEdit }: MediaProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('dashboard.product.media')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('dashboard.product.images')}</FormLabel>
              <FormControl>
                <MultiImageUpload
                  value={field.value ?? []}
                  onChange={field.onChange}
                  existingImages={isEdit ? (product?.images ?? []) : []}
                  onExistingChange={(imgs) => {
                    form.setValue('keep_images', imgs, { shouldDirty: true })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
