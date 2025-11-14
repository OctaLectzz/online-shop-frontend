import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import ImagePreview from '@/components/image/image-preview'
import LongText from '@/components/long-text'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useProduct } from '@/context/product-context'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import { formatDateTime, formatIDR } from '@/utils/format'
import { getInitials } from '@/utils/get-initials'
import type { ColumnDef } from '@tanstack/react-table'
import { t } from 'i18next'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Actions
// eslint-disable-next-line react-refresh/only-export-components
function ProductActionsCell({ product }: { product: Product }) {
  const { setOpen, setCurrentRow } = useProduct()
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`edit/${product.slug}`)
  }

  const handleDelete = () => {
    setCurrentRow(product)
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

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'images',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.images')} />,
    cell: ({ row }) => {
      const imgs = row.original.images ?? []
      const name = row.original.name

      if (!imgs.length) {
        return (
          <div className="flex justify-center">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarFallback className="rounded-lg text-xs">{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
        )
      }

      return (
        <div className="flex justify-center">
          <Carousel className="w-28">
            <CarouselContent>
              {imgs.map((src, i) => (
                <CarouselItem key={`${row.original.id}-img-${i}`} className="flex justify-center p-0.5">
                  <ImagePreview src={src} alt={`${name}-${i + 1}`} className="h-12 w-12 cursor-zoom-in rounded-md object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-[-6px] h-4 w-4 p-0 text-xs" />
            <CarouselNext className="right-[-6px] h-4 w-4 p-0 text-xs" />
          </Carousel>
        </div>
      )
    },
    meta: { className: 'w-40 text-center' }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.name')} />,
    cell: ({ row }) => <LongText className="max-w-60">{row.original.name}</LongText>,
    meta: { className: 'w-60' }
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.sku')} />,
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.sku}</span>,
    meta: { className: 'w-40' }
  },
  {
    accessorKey: 'category_id',
    header: () => null,
    cell: () => null,
    enableHiding: false,
    enableSorting: false,
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      const value = String(row.getValue(id))
      return filterValue.includes(value)
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.category')} />,
    cell: ({ row }) => {
      const category = row.original.category
      if (!category) return <span>-</span>

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-md">{category.image ? <AvatarImage src={category.image} alt={category.name} className="rounded-md object-cover" /> : <AvatarFallback className="rounded-md">{getInitials(category.name)}</AvatarFallback>}</Avatar>

          <span className="font-medium">{category.name}</span>
        </div>
      )
    },
    meta: { className: 'w-44' }
  },
  {
    id: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.price')} />,
    cell: ({ row }) => {
      const product = row.original
      const variants = product.variants ?? []

      if (!product.use_variant) {
        const price = variants[0]?.price ?? 0
        return <span className="font-medium">{formatIDR(price)}</span>
      }
      if (variants.length === 0) {
        return <span className="text-muted-foreground">-</span>
      }

      const prices = variants.map((v) => Number(v.price || 0))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      if (minPrice === maxPrice) {
        return <span className="font-medium">{formatIDR(minPrice)}</span>
      }

      return (
        <span className="font-medium">
          {formatIDR(minPrice)} - {formatIDR(maxPrice)}
        </span>
      )
    },
    meta: { className: 'w-36' }
  },
  {
    id: 'stock',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.stock')} />,
    cell: ({ row }) => {
      const totalStock = row.original.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0)
      return <span className="tabular-nums">{totalStock}</span>
    },
    meta: { className: 'w-28 text-center' }
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
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('dashboard.product.createdAt')} />,
    cell: ({ row }) => <span className="text-muted-foreground text-xs">{formatDateTime(row.original.created_at)}</span>,
    meta: { className: 'w-44' }
  },
  {
    id: 'actions',
    header: t('public.actionText'),
    cell: ({ row }) => <ProductActionsCell product={row.original} />,
    meta: { className: 'w-24 text-center' }
  }
]
