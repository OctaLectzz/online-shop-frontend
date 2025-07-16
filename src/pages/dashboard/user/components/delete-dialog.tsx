'use client'

import { ConfirmDialog } from '@/components/dashboard/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteUser } from '@/hooks/use-user'
import type { User } from '@/types'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UserDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { mutate: deleteUser, isPending } = useDeleteUser()

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    deleteUser(currentRow.id, {
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
      disabled={value.trim() !== currentRow.username || isPending}
      title={
        <span className="text-destructive">
          <AlertTriangle className="stroke-destructive mr-1 inline-block" size={18} />
          {t('public.deleteText')} {t('dashboard.user.title')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentRow.username}</span>?
            <br />
            This action will permanently remove the user from the system.
          </p>

          <Label className="my-2">
            Username:
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter username to confirm deletion." />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>This operation cannot be undone. All user data will be permanently deleted.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? t('public.loadingText') : t('public.deleteText')}
      destructive
    />
  )
}
