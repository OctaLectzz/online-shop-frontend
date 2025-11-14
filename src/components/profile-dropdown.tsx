import { LogoutDialog } from '@/components/logout-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { User } from '@/types/user'
import { getInitials } from '@/utils/get-initials'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ImagePreview from './image/image-preview'

export function ProfileDropdown({ user, onLogoutConfirm, isPending }: { user: User; onLogoutConfirm: () => void; isPending: boolean }) {
  const { t } = useTranslation()
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!user?.avatar) {
      setAvatarSrc(undefined)
      return
    }

    if (typeof user.avatar === 'string') {
      setAvatarSrc(user.avatar)
      return
    }

    const url = URL.createObjectURL(user.avatar)
    setAvatarSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [user?.avatar])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarSrc} alt="@user" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex font-normal">
          <div className="flex items-center gap-2 text-left text-sm">
            {avatarSrc ? (
              <ImagePreview src={avatarSrc} alt={user.name} className="h-9 w-9 cursor-zoom-in rounded-lg border object-cover" />
            ) : (
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            )}

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              {t('dashboard.layout.profileMenu')} <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings">
              {t('dashboard.layout.settingMenu')} <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <LogoutDialog
          trigger={
            <button className="hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm focus:outline-none">
              {t('auth.logoutBtn')}
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          }
          onConfirm={onLogoutConfirm}
          isPending={isPending}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
