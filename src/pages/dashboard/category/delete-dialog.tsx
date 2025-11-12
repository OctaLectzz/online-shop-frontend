'use client'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDeleteCategory } from '@/hooks/use-category'
import type { Category } from '@/types/category'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Category
}

export function CategoryDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { t } = useTranslation()
  const { mutate: deleteCategory, isPending } = useDeleteCategory()

  const handleDelete = () => {
    deleteCategory(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="stroke-destructive mr-1 inline-block" size={18} />
          {t('public.deleteText')} {t('dashboard.category.title')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('public.deleteDesc')} <span className="font-bold">{currentRow.name}</span>?
            <br />
            {t('dashboard.category.deleteDesc1')}
          </p>

          <Alert variant="destructive">
            <AlertTitle>{t('public.warningText')}</AlertTitle>
            <AlertDescription>{t('dashboard.category.deleteDesc2')}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? t('public.loadingText') : t('public.deleteText')}
      destructive
    />
  )
}
