import type { LoginResponse } from '@/types/auth'
import type { SidebarData } from '@/types/layout'
import i18n from '@/utils/i18n'
import { Boxes, Contact, DollarSign, HelpCircle, LayoutDashboard, ListChecks, Package, Settings, ShoppingCart, Tags, Users2 } from 'lucide-react'

const t = i18n.t.bind(i18n)

export const sidebarData = (user: LoginResponse['user']): SidebarData => ({
  user,
  navGroups: [
    {
      title: t('dashboard.layout.generalGroup'),
      items: [
        { title: t('dashboard.layout.dashboardMenu'), url: '/dashboard', icon: LayoutDashboard },
        { title: t('dashboard.layout.roleMenu'), url: '/dashboard/role', icon: ListChecks },
        { title: t('dashboard.layout.userMenu'), url: '/dashboard/user', icon: Users2 }
      ]
    },
    {
      title: t('dashboard.layout.managementGroup'),
      items: [
        { title: t('dashboard.layout.categoryMenu'), url: '/dashboard/category', icon: Boxes },
        { title: t('dashboard.layout.productMenu'), url: '/dashboard/product', icon: Package },
        { title: t('dashboard.layout.tagMenu'), url: '/dashboard/tag', icon: Tags },
        { title: t('dashboard.layout.promoMenu'), url: '/dashboard/promo', icon: DollarSign },
        { title: t('dashboard.layout.paymentMenu'), url: '/dashboard/payment', icon: DollarSign }
      ]
    },
    {
      title: t('dashboard.layout.transactionGroup'),
      items: [
        { title: t('dashboard.layout.orderMenu'), url: '/dashboard/order', icon: ShoppingCart },
        { title: t('dashboard.layout.payMenu'), url: '/dashboard/pay', icon: DollarSign },
        { title: t('dashboard.layout.shipmentMenu'), url: '/dashboard/shipment', icon: Package }
      ]
    },
    {
      title: t('dashboard.layout.otherGroup'),
      items: [
        { title: t('dashboard.layout.faqMenu'), url: '/dashboard/faq', icon: HelpCircle },
        { title: t('dashboard.layout.contactMenu'), url: '/dashboard/contact', icon: Contact },
        { title: t('dashboard.layout.settingMenu'), url: '/dashboard/setting', icon: Settings }
      ]
    }
  ]
})
