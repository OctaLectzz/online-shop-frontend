import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductFormValues } from '@/schemas/product-schema'
import type { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'attributes'>[]
  addAttribute: UseFieldArrayAppend<ProductFormValues, 'attributes'>
  removeAttribute: UseFieldArrayRemove
}

export function ProductAttributesCard({ form, fields, addAttribute, removeAttribute }: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.attributes')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name={`attributes.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('dashboard.product.attributeName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="sm" className="mt-6 shrink-0 text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => removeAttribute(index)}>
                {t('public.deleteText')}
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`attributes.${index}.lists`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.product.attributeValues')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Blue, Pink, Green"
                      value={field.value?.join(', ') ?? ''}
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
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            addAttribute({
              name: '',
              lists: [],
              _delete: false
            })
          }
        >
          + {t('dashboard.product.addAttribute')}
        </Button>
      </CardContent>
    </Card>
  )
}
