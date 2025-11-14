import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductFormValues } from '@/schemas/product-schema'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface TagsProps {
  form: UseFormReturn<ProductFormValues>
}

export function ProductTagsCard({ form }: TagsProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.tagsTitle')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            const tags = field.value ?? []

            return (
              <FormItem>
                <FormLabel>{t('dashboard.product.tags')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('dashboard.product.tagPlaceholder')}
                    value={tags.join(', ')}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .split(',')
                          .map((v) => v.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />

                {tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}
