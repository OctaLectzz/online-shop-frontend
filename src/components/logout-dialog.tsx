import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useTranslation } from 'react-i18next'

interface LogoutDialogProps {
  trigger: React.ReactNode
  onConfirm: () => void
  isPending?: boolean
}

export function LogoutDialog({ trigger, onConfirm, isPending }: LogoutDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('auth.logoutTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('auth.logoutSubtitle')}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t('public.cancelText')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? t('public.loadingText') : t('auth.logoutBtn')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
