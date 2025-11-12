import useDialogState from '@/hooks/use-dialog-state'
import type { User } from '@/types/user'
import React, { useState } from 'react'

type UserDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface UserContextType {
  open: UserDialogType | null
  setOpen: (str: UserDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = React.createContext<UserContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UserProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UserDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return <UserContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</UserContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const usersContext = React.useContext(UserContext)

  if (!usersContext) {
    throw new Error('useUser has to be used within <UserContext>')
  }

  return usersContext
}
