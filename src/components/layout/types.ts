import type { LoginResponse } from '@/types'

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: string
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarData {
  user: LoginResponse['user']
  navGroups: NavGroup[]
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData }
