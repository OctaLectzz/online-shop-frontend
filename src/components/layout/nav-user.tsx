import ImagePreview from '@/components/image/image-preview'
import { LogoutDialog } from '@/components/logout-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import type { User } from '@/types/user'
import { getInitials } from '@/utils/get-initials'
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NavUser({ user, onLogoutConfirm, isPending }: { user: User; onLogoutConfirm: () => void; isPending: boolean }) {
  const { t } = useTranslation()
  const { isMobile } = useSidebar()
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
                <Link to="/settings/account">
                  <BadgeCheck />
                  {t('dashboard.layout.accountMenu')}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <CreditCard />
                  {t('dashboard.layout.settingMenu')}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/settings/notification">
                  <Settings />
                  {t('dashboard.layout.notificationMenu')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <LogoutDialog
              trigger={
                <button className="hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none" role="menuitem">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">{t('auth.logoutBtn')}</span>
                </button>
              }
              onConfirm={onLogoutConfirm}
              isPending={isPending}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
