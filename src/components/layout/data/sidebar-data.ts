import type { SidebarData } from '@/components/layout/types'
import type { LoginResponse } from '@/types'
import { Boxes, Contact, DollarSign, HelpCircle, LayoutDashboard, ListChecks, Package, Settings, ShoppingCart, Tags, Users2 } from 'lucide-react'

export const sidebarData = (user: LoginResponse['user']): SidebarData => ({
  user,
  navGroups: [
    {
      title: 'General',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Role', url: '/dashboard/role', icon: ListChecks },
        { title: 'Users', url: '/dashboard/user', icon: Users2 }
      ]
    },
    {
      title: 'Management',
      items: [
        { title: 'Categories', url: '/dashboard/category', icon: Boxes },
        { title: 'Products', url: '/dashboard/product', icon: Package },
        { title: 'Tags', url: '/dashboard/tag', icon: Tags },
        { title: 'Promos', url: '/dashboard/promo', icon: DollarSign },
        { title: 'Payments', url: '/dashboard/payment', icon: DollarSign }
      ]
    },
    {
      title: 'Transaction',
      items: [
        { title: 'Orders', url: '/dashboard/order', icon: ShoppingCart },
        { title: 'Pays', url: '/dashboard/pay', icon: DollarSign },
        { title: 'Shipments', url: '/dashboard/shipment', icon: Package }
      ]
    },
    {
      title: 'Other',
      items: [
        { title: 'Faq', url: '/dashboard/faq', icon: HelpCircle },
        { title: 'Contact', url: '/dashboard/contact', icon: Contact },
        { title: 'Setting', url: '/dashboard/setting', icon: Settings }
      ]
    }
  ]
})
