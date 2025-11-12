import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CategoryProvider, { useCategory } from '@/context/category-context'
import { useCategories } from '@/hooks/use-category'
import { type ColumnFiltersState, type RowData, type SortingState, type VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { columns } from './columns'
import { CategoryDeleteDialog } from './delete-dialog'
import { CategoryForm } from './form'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

function CategoryContent() {
  const { open, setOpen, currentRow } = useCategory()
  const { data: categories = [], isPending } = useCategories()

  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: categories,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  // Filter
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <>
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('dashboard.category.titleList')}</h2>
          <p className="text-muted-foreground">{t('dashboard.category.desc')}</p>
        </div>

        <div className="flex gap-2">
          <Button className="space-x-1" onClick={() => setOpen('add')} disabled={isPending}>
            <span>
              {t('public.createText')} {t('dashboard.category.title')}
            </span>
            <PlusCircle size={18} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            {/* Status */}
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
              <Input placeholder={t('dashboard.category.filterText')} value={(table.getColumn('name')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)} className="h-8 w-[150px] lg:w-[250px]" />

              {isFiltered && (
                <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                  {t('public.resetText')}
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* View */}
            <DataTableViewOptions table={table} />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="group/row">
                    <TableHead className="w-12 text-center">No.</TableHead>

                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan} className={header.column.columnDef.meta?.className ?? ''}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => {
                    const { pageIndex, pageSize } = table.getState().pagination
                    const rowNumber = pageIndex * pageSize + rowIndex + 1

                    return (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="group/row">
                        <TableCell className="w-12 text-center">{rowNumber}</TableCell>

                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={cell.column.columnDef.meta?.className ?? ''}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      {t('public.noResultText')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <DataTablePagination table={table} />
        </div>
      </div>

      {/* Dialogs */}
      <CategoryForm key="category-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />
      {currentRow && (
        <>
          <CategoryForm key={`category-edit-${currentRow.id}`} open={open === 'edit'} onOpenChange={(isOpen) => setOpen(isOpen ? 'edit' : null)} currentRow={currentRow} />

          <CategoryDeleteDialog key={`category-delete-${currentRow.id}`} open={open === 'delete'} onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)} currentRow={currentRow} />
        </>
      )}
    </>
  )
}

export default function Category() {
  return (
    <CategoryProvider>
      <CategoryContent />
    </CategoryProvider>
  )
}
