import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ProductFormValues } from '@/schemas/product-schema'
import { productInformationSchema, type ProductInformationForm } from '@/schemas/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, type FieldArrayWithId, type UseFieldArrayAppend, type UseFieldArrayRemove, type UseFieldArrayUpdate, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'informations'>[]
  addInformation: UseFieldArrayAppend<ProductFormValues, 'informations'>
  updateInformation: UseFieldArrayUpdate<ProductFormValues, 'informations'>
  removeInformation: UseFieldArrayRemove
}

export function ProductInformationsCard({ form, fields, addInformation, updateInformation, removeInformation }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const informationForm = useForm<ProductInformationForm>({
    resolver: zodResolver(productInformationSchema),
    defaultValues: {
      id: undefined,
      name: '',
      description: ''
    }
  })

  const activeInformations = fields.filter((_, index) => {
    const info = form.watch(`informations.${index}`)
    return !info?._delete
  })

  const resetInformationForm = () => {
    informationForm.reset({
      id: undefined,
      name: '',
      description: ''
    })
    setEditIndex(null)
  }

  const handleDialogChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      resetInformationForm()
    }
  }

  const handleAddInformation = () => {
    resetInformationForm()
    setOpen(true)
  }

  const handleEditInformation = (index: number) => {
    const information = form.getValues(`informations.${index}`)
    informationForm.reset({
      id: information?.id,
      name: information?.name ?? '',
      description: information?.description ?? ''
    })
    setEditIndex(index)
    setOpen(true)
  }

  const handleDeleteInformation = (index: number) => {
    const information = form.getValues(`informations.${index}`)

    if (information?.id) {
      updateInformation(index, { ...information, _delete: true })
    } else {
      removeInformation(index)
    }
  }

  const onSubmitInfo = (values: ProductInformationForm) => {
    if (editIndex !== null) {
      const prev = form.getValues(`informations.${editIndex}`)
      updateInformation(editIndex, {
        ...prev,
        id: prev?.id ?? values.id,
        name: values.name,
        description: values.description
      })
    } else {
      addInformation({
        name: values.name,
        description: values.description
      })
    }

    resetInformationForm()
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.informations')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-4 py-1">
        {/* List informations */}
        <div className="space-y-2">
          {activeInformations.length === 0 && (
            <div className="flex items-center justify-center gap-4 rounded-md border p-3">
              <div className="text-muted-foreground text-center text-xs">{t('dashboard.product.informationsEmpty')}</div>
            </div>
          )}

          {fields.map((field, index) => {
            const information = form.watch(`informations.${index}`)

            if (information?._delete) return null

            return (
              <div key={field.id} className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{information?.name || t('dashboard.product.informationName')}</p>
                  <p className="text-muted-foreground text-xs whitespace-pre-line">{information?.description || t('dashboard.product.informationDescriptionPlaceholder')}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted h-7 w-7 p-1" onClick={() => handleEditInformation(index)} aria-label={t('public.editText')}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 p-1 text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => handleDeleteInformation(index)} aria-label={t('public.deleteText')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add information button */}
        <Button type="button" variant="outline" size="sm" onClick={handleAddInformation}>
          + {t('dashboard.product.addInformation')}
        </Button>

        {/* Modal Add / Edit Information */}
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? t('dashboard.product.editInformationTitle') : t('dashboard.product.addInformation')}</DialogTitle>
              <DialogDescription>{editIndex !== null ? t('dashboard.product.editInformationDesc') : t('dashboard.product.addInformationDesc')}</DialogDescription>
            </DialogHeader>

            <Form {...informationForm}>
              <div className="space-y-4">
                {/* Name */}
                <FormField
                  control={informationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        {t('dashboard.product.informationName')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Warranty" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={informationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        {t('dashboard.product.informationDescription')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} placeholder={t('dashboard.product.informationDescriptionPlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-2">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    {t('public.cancelText')}
                  </Button>
                  <Button type="button" onClick={informationForm.handleSubmit(onSubmitInfo)}>
                    {t('public.saveText')}
                  </Button>
                </DialogFooter>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
