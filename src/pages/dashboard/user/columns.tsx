import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import ImagePreview from '@/components/image/image-preview'
import LongText from '@/components/long-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { cn } from '@/lib/utils'
import type { User } from '@/types/user'
import type { ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { Edit, Trash } from 'lucide-react'

// Actions
// eslint-disable-next-line react-refresh/only-export-components
function UserActionsCell({ user }: { user: User }) {
  const { setOpen, setCurrentRow } = useUser()

  const handleEdit = () => {
    setCurrentRow(user)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(user)
    setOpen('delete')
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleEdit} title="Edit" className="text-yellow-600 hover:bg-yellow-100 hover:text-yellow-600">
        <Edit className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete" className="text-red-600 hover:bg-red-100 hover:text-red-600">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.avatar')} />,
    cell: ({ row }) => {
      const value = row.original.avatar as string | File | null | undefined

      const imgUrl = typeof value === 'string' ? value : value instanceof File ? URL.createObjectURL(value) : undefined

      return (
        <div className="flex justify-center">
          <ImagePreview src={imgUrl} alt={row.original.name} initials={row.original.name} shape="round" className="h-10 w-10" />
        </div>
      )
    },
    meta: { className: 'w-16 text-center' }
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.username')} />,
    cell: ({ row }) => <LongText className="max-w-36">{row.getValue('username')}</LongText>,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.name')} />,
    cell: ({ row }) => {
      return <LongText className="max-w-48">{row.getValue('name')}</LongText>
    },
    meta: { className: 'w-48' }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.email')} />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.phoneNumber')} />,
    cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.user.status')} />,
    cell: ({ row }) => {
      const status = row.original.status
      const isActive = status === true || status === 1
      const badgeColor = isActive ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200' : 'bg-red-300/40 text-red-900 dark:text-red-200 border-red-300'

      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {isActive ? t('public.activeText') : t('public.inactiveText')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const status = row.getValue(id)
      const isActive = status === true || status === 1
      return value.includes(isActive ? 'active' : 'inactive')
    },
    enableHiding: false
  },
  {
    id: 'actions',
    header: t('public.actionText'),
    cell: ({ row }) => <UserActionsCell user={row.original as User} />,
    meta: { className: 'w-24 text-center' }
  }
]
