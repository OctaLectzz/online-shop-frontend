import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import type { SidebarData } from '@/types/layout'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function CommandMenu({ sidebarData }: { sidebarData: SidebarData }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('public.commandDesc')} />

      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>{t('public.noResultText')}</CommandEmpty>

          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) =>
                navItem.url ? (
                  <CommandItem key={`${navItem.url}-${i}`} value={navItem.title} onSelect={() => runCommand(() => navigate(navItem.url))} className="cursor-pointer">
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <ArrowRight className="text-muted-foreground/80 size-2" />
                    </div>
                    {navItem.title}
                  </CommandItem>
                ) : (
                  navItem.items?.map((subItem, i) => (
                    <CommandItem key={`${navItem.title}-${subItem.url}-${i}`} value={`${navItem.title}-${subItem.url}`} onSelect={() => runCommand(() => navigate(subItem.url))} className="cursor-pointer">
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <ArrowRight className="text-muted-foreground/80 size-2" />
                      </div>
                      {navItem.title} <ChevronRight /> {subItem.title}
                    </CommandItem>
                  ))
                )
              )}
            </CommandGroup>
          ))}

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))} className="cursor-pointer">
              <Sun /> <span>{t('dashboard.layout.lightTheme')}</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))} className="cursor-pointer">
              <Moon className="scale-90" />
              <span>{t('dashboard.layout.darkTheme')}</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme('system'))} className="cursor-pointer">
              <Laptop />
              <span>{t('dashboard.layout.systemTheme')}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
