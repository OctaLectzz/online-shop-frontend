import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import ImagePreview from '@/components/image/image-preview'
import LongText from '@/components/long-text'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCategory } from '@/context/category-context'
import type { Category } from '@/types/category'
import { getInitials } from '@/utils/get-initials'
import type { ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { Edit, Trash } from 'lucide-react'

// Actions
// eslint-disable-next-line react-refresh/only-export-components
function CategoryActionsCell({ category }: { category: Category }) {
  const { setOpen, setCurrentRow } = useCategory()

  const handleEdit = () => {
    setCurrentRow(category)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(category)
    setOpen('delete')
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleEdit} title={t('public.editText')} className="text-yellow-600 hover:bg-yellow-100 hover:text-yellow-600">
        <Edit className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={handleDelete} title={t('public.deleteText')} className="text-red-600 hover:bg-red-100 hover:text-red-600">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'image',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.category.image')} />,
    cell: ({ row }) => {
      const imgUrl = row.original.image as string | undefined

      return (
        <div className="flex justify-center">
          {imgUrl ? (
            <ImagePreview src={imgUrl} alt={row.original.name} className="h-10 w-10 cursor-zoom-in rounded-lg border object-cover" />
          ) : (
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarFallback className="rounded-lg">{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )
    },
    meta: { className: 'w-16 text-center' }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.category.name')} />,
    cell: ({ row }) => {
      return (
        <>
          <LongText className="max-w-48">{row.original.name}</LongText>
        </>
      )
    },
    meta: { className: 'w-48' }
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.category.description')} />,
    cell: ({ row }) => <LongText className="max-w-60">{row.original.description}</LongText>,
    meta: { className: 'w-60' }
  },
  {
    id: 'actions',
    header: t('public.actionText'),
    cell: ({ row }) => <CategoryActionsCell category={row.original} />,
    meta: { className: 'w-24 text-center' }
  }
]
