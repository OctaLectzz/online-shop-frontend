import { DataTableDataFilter } from '@/components/data-table/data-table-filter'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import UserProvider, { useUser } from '@/context/user-context'
import { useUsers } from '@/hooks/use-user'
import { type ColumnFiltersState, type RowData, type SortingState, type VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { columns } from './columns'
import { UserDeleteDialog } from './delete-dialog'
import { UserForm } from './form'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

function UserContent() {
  const { open, setOpen, currentRow } = useUser()
  const { data: users = [], isPending } = useUsers()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: users,
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
          <h2 className="text-2xl font-bold tracking-tight">User List</h2>
          <p className="text-muted-foreground">Manage your users and their roles here.</p>
        </div>

        <div className="flex gap-2">
          <Button className="space-x-1" onClick={() => setOpen('add')} disabled={isPending}>
            <span>Add User</span> <UserPlus size={18} />
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
              <Input placeholder="Filter users..." value={(table.getColumn('username')?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)} className="h-8 w-[150px] lg:w-[250px]" />
              <div className="flex gap-x-2">
                {table.getColumn('status') && (
                  <DataTableDataFilter
                    column={table.getColumn('status')}
                    title="Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' }
                    ]}
                  />
                )}
              </div>
              {isFiltered && (
                <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                  Reset
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
                      No results.
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
      <UserForm key="user-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />
      {currentRow && (
        <>
          <UserForm key={`user-edit-${currentRow.id}`} open={open === 'edit'} onOpenChange={(isOpen) => setOpen(isOpen ? 'edit' : null)} currentRow={currentRow} />

          <UserDeleteDialog key={`user-delete-${currentRow.id}`} open={open === 'delete'} onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)} currentRow={currentRow} />
        </>
      )}
    </>
  )
}

export default function User() {
  return (
    <UserProvider>
      <UserContent />
    </UserProvider>
  )
}
