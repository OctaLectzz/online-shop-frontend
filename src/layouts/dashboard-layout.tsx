import { CommandMenu } from '@/components/command-menu'
import { sidebarData as generateSidebarData } from '@/components/layout/data/sidebar-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import SkipToMain from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarProvider, SidebarRail } from '@/components/ui/sidebar'
import { useAuth } from '@/context/auth-context'
import { useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const { user } = useAuth()
  const { mutate: logout, isPending } = useLogout()

  // User
  if (!user) return null
  const sidebarData = generateSidebarData(user)

  // Logout
  const handleLogout = () => {
    logout()
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SkipToMain />

      {/* Sidebar */}
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{t('public.brandName')}</span>
                <span className="truncate text-xs">{sidebarData.user.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {sidebarData.navGroups.map((group) => (
            <NavGroup key={group.title} {...group} />
          ))}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={sidebarData.user} onLogoutConfirm={handleLogout} isPending={isPending} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Search List */}
      <CommandMenu sidebarData={sidebarData} />

      <div
        id="content"
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'flex h-svh flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
        )}
      >
        {/* Navbar */}
        <Header fixed>
          {/* Search */}
          <Search />

          <div className="ml-auto flex items-center space-x-4">
            {/* Theme */}
            <ThemeSwitch />

            {/* Profile */}
            <ProfileDropdown user={sidebarData.user} onLogoutConfirm={handleLogout} isPending={isPending} />
          </div>
        </Header>

        {/* Page */}
        <Main>
          <Outlet />
        </Main>
      </div>
    </SidebarProvider>
  )
}
