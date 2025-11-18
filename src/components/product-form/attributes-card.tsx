import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductFormValues } from '@/schemas/product-schema'
import { productAttributeSchema, type ProductAttributeForm } from '@/schemas/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, type FieldArrayWithId, type UseFieldArrayAppend, type UseFieldArrayRemove, type UseFieldArrayUpdate, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
  fields: FieldArrayWithId<ProductFormValues, 'attributes'>[]
  addAttribute: UseFieldArrayAppend<ProductFormValues, 'attributes'>
  updateAttribute: UseFieldArrayUpdate<ProductFormValues, 'attributes'>
  removeAttribute: UseFieldArrayRemove
}

export function ProductAttributesCard({ form, fields, addAttribute, updateAttribute, removeAttribute }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const attributeForm = useForm<ProductAttributeForm>({
    resolver: zodResolver(productAttributeSchema),
    defaultValues: {
      id: undefined,
      name: '',
      lists: []
    }
  })

  const lists = attributeForm.watch('lists') ?? []

  const handleAddValue = () => {
    const trimmed = currentValue.trim()
    if (!trimmed) return
    if (lists.includes(trimmed)) {
      setCurrentValue('')
      return
    }

    const newLists = [...lists, trimmed]
    attributeForm.setValue('lists', newLists, { shouldValidate: true })
    setCurrentValue('')
  }

  const handleRemoveValue = (index: number) => {
    const newLists = lists.filter((_, i) => i !== index)
    attributeForm.setValue('lists', newLists, { shouldValidate: true })
  }

  const resetAttributeForm = () => {
    attributeForm.reset({
      id: undefined,
      name: '',
      lists: []
    })
    setCurrentValue('')
    setEditIndex(null)
  }

  const handleDialogChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      resetAttributeForm()
    }
  }

  const handleAddClick = () => {
    resetAttributeForm()
    setOpen(true)
  }

  const handleEditClick = (index: number) => {
    const attr = form.getValues(`attributes.${index}`)
    attributeForm.reset({
      id: attr?.id,
      name: attr?.name ?? '',
      lists: attr?.lists ?? []
    })
    setCurrentValue('')
    setEditIndex(index)
    setOpen(true)
  }

  const onSubmitAttribute = (values: ProductAttributeForm) => {
    if (editIndex !== null) {
      const prev = form.getValues(`attributes.${editIndex}`)

      updateAttribute(editIndex, {
        ...prev,
        id: prev?.id ?? values.id,
        name: values.name,
        lists: values.lists
      })
    } else {
      addAttribute({
        name: values.name,
        lists: values.lists
      })
    }

    resetAttributeForm()
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.attributes')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-4 py-1">
        {/* List attributes */}
        <div className="space-y-2">
          {fields.length === 0 && (
            <div className="flex items-center justify-center gap-4 rounded-md border p-3">
              <div className="text-muted-foreground text-center text-xs">{t('dashboard.product.attributesEmpty')}</div>
            </div>
          )}

          {fields.map((field, index) => {
            const attr = form.watch(`attributes.${index}`)

            return (
              <div key={field.id} className="flex items-center justify-between gap-4 rounded-md border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{attr?.name}</p>

                  <div className="mt-1 flex flex-wrap gap-2">
                    {attr?.lists?.length ? (
                      attr.lists.map((value: string, i: number) => (
                        <Badge key={`${value}-${i}`} variant="secondary">
                          {value}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">{t('dashboard.product.attributeValuesEmpty')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted h-7 w-7 p-1" onClick={() => handleEditClick(index)} aria-label={t('public.editText')}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 p-1 text-red-600 hover:bg-red-100 hover:text-red-600" onClick={() => removeAttribute(index)} aria-label={t('public.deleteText')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add attribute button */}
        <Button type="button" variant="outline" size="sm" onClick={handleAddClick}>
          + {t('dashboard.product.addAttribute')}
        </Button>

        {/* Modal Add / Edit Attribute */}
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? t('dashboard.product.editAttributeTitle') : t('dashboard.product.addAttribute')}</DialogTitle>
              <DialogDescription>{editIndex !== null ? t('dashboard.product.editAttributeDesc') : t('dashboard.product.addAttributeDesc')}</DialogDescription>
            </DialogHeader>

            <Form {...attributeForm}>
              <div className="space-y-4">
                {/* Attribute name */}
                <FormField
                  control={attributeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        {t('dashboard.product.attributeName')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Color" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Attribute values */}
                <FormField
                  control={attributeForm.control}
                  name="lists"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="gap-1">
                        {t('dashboard.product.attributeValues')}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('dashboard.product.attributeValuesPlaceholder') || 'Blue'}
                          value={currentValue}
                          onChange={(e) => setCurrentValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddValue()
                              field.onChange(attributeForm.getValues('lists'))
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>{t('dashboard.product.attributeValuesHint')}</FormDescription>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {lists.map((value, index) => (
                          <Badge key={`${value}-${index}`} variant="secondary" className="flex items-center gap-1">
                            <span>{value}</span>
                            <button
                              type="button"
                              className="text-xs leading-none"
                              onClick={() => {
                                handleRemoveValue(index)
                                field.onChange(attributeForm.getValues('lists'))
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    {t('public.cancelText')}
                  </Button>
                  <Button type="button" onClick={attributeForm.handleSubmit(onSubmitAttribute)}>
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
