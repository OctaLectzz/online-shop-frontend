'use client'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteProduct } from '@/hooks/use-product'
import type { Product } from '@/types/product'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

export function ProductDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { mutate: deleteProduct, isPending } = useDeleteProduct()

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    deleteProduct(currentRow.slug, {
      onSuccess: () => {
        onOpenChange(false)
        setValue('')
      }
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="stroke-destructive mr-1 inline-block" size={18} />
          {t('public.deleteText')} {t('dashboard.product.title')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('public.deleteDesc')} <span className="font-bold">{currentRow.name}</span>?
            <br />
            {t('dashboard.product.deleteDesc1')}
          </p>

          <Label className="my-2">
            {t('dashboard.product.name')}:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={t('dashboard.product.deletePlaceholder')} />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>{t('public.warningText')}</AlertTitle>
            <AlertDescription>{t('dashboard.product.deleteDesc2')}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? t('public.loadingText') : t('public.deleteText')}
      destructive
    />
  )
}
