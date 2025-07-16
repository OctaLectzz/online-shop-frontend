import { DataTableColumnHeader } from '@/components/dashboard/data-table-column-header'
import LongText from '@/components/long-text'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { User } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './actions'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <LongText className="max-w-36">{row.getValue('username')}</LongText>,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <LongText className="max-w-36">{row.getValue('name')}</LongText>
    },
    meta: { className: 'w-36' }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone Number" />,
    cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      const isActive = status === true || status === 1
      const badgeColor = isActive ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200' : 'bg-neutral-300/40 border-neutral-300'

      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {isActive ? 'Active' : 'Inactive'}
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
    cell: DataTableRowActions
  }
]
