'use client'

import { ImageCircleUpload } from '@/components/image-circle-upload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCategory, useUpdateCategory } from '@/hooks/use-category'
import { categoryCreateSchema, categoryUpdateSchema, type CategoryValues } from '@/schemas/category-schema'
import type { Category } from '@/types/category'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface CategoryValuesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
}

export function CategoryForm({ open, onOpenChange, currentRow }: CategoryValuesProps) {
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const { t } = useTranslation()
  const isEdit = !!currentRow
  const schema = isEdit ? categoryUpdateSchema : categoryCreateSchema
  const isSubmitting = isCreating || isUpdating

  const form = useForm<CategoryValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: null,
      name: '',
      description: '',
      isEdit: !!currentRow,
      ...(currentRow
        ? {
            ...currentRow,
            image: typeof currentRow.image === 'string' ? null : currentRow.image
          }
        : {})
    }
  })

  const onSubmit = (values: CategoryValues) => {
    if (isEdit && currentRow?.id) {
      updateCategory(
        { ...values, id: currentRow.id },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          }
        }
      )
    } else {
      createCategory(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        }
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="category-form" className="space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle>
                {isEdit ? t('public.editText') : t('public.createText')} {t('dashboard.category.title')}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? t('dashboard.category.editDesc') : t('dashboard.category.createDesc')} {t('public.saveDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="-mr-4 h-[26.25rem] w-full space-y-4 overflow-y-auto py-1 pr-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <ImageCircleUpload value={field.value ?? null} onChange={field.onChange} currentImage={typeof currentRow?.image === 'string' ? currentRow.image : undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.category.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Fashion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.category.description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" form="category-form" disabled={isSubmitting}>
                {isSubmitting ? t('public.loadingText') : t('public.saveText')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
