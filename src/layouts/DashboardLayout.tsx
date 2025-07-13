import { CommandMenu } from '@/components/command-menu'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { sidebarData as generateSidebarData } from '@/components/layout/data/sidebar-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import SkipToMain from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'
import Cookies from 'js-cookie'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const { user } = useAuth()

  if (!user) return null // Atau tampilkan loader/spinner

  const sidebarData = generateSidebarData(user)

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SkipToMain />
      <AppSidebar sidebarData={sidebarData} />
      <CommandMenu sidebarData={sidebarData} />

      <div id="content" className={cn('ml-auto w-full max-w-full', 'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]', 'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]', 'sm:transition-[width] sm:duration-200 sm:ease-linear', 'flex h-svh flex-col', 'group-data-[scroll-locked=1]/body:h-full', 'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh')}>
        <Header fixed>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown user={sidebarData.user} />
          </div>
        </Header>

        <Main>
          <Outlet />
        </Main>
      </div>
    </SidebarProvider>
  )
}
