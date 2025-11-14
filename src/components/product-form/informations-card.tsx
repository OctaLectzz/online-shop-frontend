import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ProductFormValues } from '@/schemas/product-schema'
import type { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'informations'>[]
  addInfo: UseFieldArrayAppend<ProductFormValues, 'informations'>
  removeInfo: UseFieldArrayRemove
}

export function ProductInformationsCard({ form, fields, addInfo, removeInfo }: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.informations')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name={`informations.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t('dashboard.product.infoName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Warranty" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="sm" className="mt-6 shrink-0 text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => removeInfo(index)}>
                {t('public.deleteText')}
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`informations.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dashboard.product.infoDescription')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
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
            addInfo({
              name: '',
              description: '',
              _delete: false
            })
          }
        >
          + {t('dashboard.product.addInformation')}
        </Button>
      </CardContent>
    </Card>
  )
}
