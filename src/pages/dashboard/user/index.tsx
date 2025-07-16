import { Button } from '@/components/ui/button'
import UserProvider, { useUser } from '@/context/user-context'
import { useUsers } from '@/hooks/use-user'
import { UserPlus } from 'lucide-react'
import { columns } from './components/columns'
import { UserDeleteDialog } from './components/delete-dialog'
import { UserForm } from './components/form'
import { UserTable } from './components/table'

function UserContent() {
  const { open, setOpen, currentRow } = useUser()
  const { data: users = [], isPending } = useUsers()

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
        <UserTable data={users} columns={columns} />
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
