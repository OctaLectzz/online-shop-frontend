import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { ProductFormValues } from '@/schemas/product-schema'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
}

export function ProductSettingsCard({ form }: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('dashboard.product.settings')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        {/* Dimensions */}
        <div className="w-full space-y-6 py-1">
          <p className="text-sm font-medium">{t('dashboard.product.dimensions')}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {(['weight', 'height', 'width', 'length'] as const).map((dimension) => {
              const unit = dimension === 'weight' ? 'gram' : 'cm'

              return (
                <FormField
                  key={dimension}
                  control={form.control}
                  name={dimension}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        {t(`dashboard.product.${dimension}`)}
                        {dimension === 'weight' && <span className="text-red-500">*</span>}
                      </FormLabel>

                      <FormControl>
                        <div className="relative">
                          <Input type="number" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} className="pr-12" />

                          {/* Unit */}
                          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">{unit}</span>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border p-3">
              <div>
                <FormLabel className="gap-1">
                  {t('dashboard.product.status')}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-muted-foreground text-xs">{t('dashboard.product.statusDesc')}</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
