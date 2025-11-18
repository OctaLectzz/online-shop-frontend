import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RestrictedInput } from '@/components/ui/restricted-input'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/use-category'
import type { ProductFormValues } from '@/schemas/product-schema'
import { getInitials } from '@/utils/get-initials'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface Props {
  form: UseFormReturn<ProductFormValues>
}

export function ProductBasicInfoCard({ form }: Props) {
  const { t } = useTranslation()
  const { data: categories, isLoading } = useCategories()
  const [open, setOpen] = useState(false)

  const createSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('dashboard.product.basicInfo')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-6 py-1">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                {t('dashboard.product.name')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="iPhone 12 Pro Max"
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value)
                    const newSlug = createSlug(value)
                    form.setValue('slug', newSlug, {
                      shouldValidate: true
                    })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                {t('dashboard.product.slug')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RestrictedInput {...field} placeholder="iphone-12-pro-max" lowercase noSpaces />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SKU */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  {t('dashboard.product.sku')}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="PRD001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => {
              const selectedCategory = categories?.find((cat) => cat.id === field.value)

              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="gap-1">
                    {t('dashboard.product.category')}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="flex h-9 w-full items-center justify-between px-3 text-sm font-normal" disabled={isLoading}>
                          {selectedCategory ? (
                            <span className="flex items-center gap-2 truncate">
                              {selectedCategory.image ? (
                                <img src={selectedCategory.image} alt={selectedCategory.name} className="h-6 w-6 rounded object-cover" />
                              ) : (
                                <Avatar className="h-6 w-6 rounded object-cover">
                                  <AvatarFallback className="rounded object-cover">{getInitials(selectedCategory.name)}</AvatarFallback>
                                </Avatar>
                              )}
                              <span className="truncate">{selectedCategory.name}</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">{isLoading ? t('public.loadingText') : t('dashboard.product.categoryPlaceholder')}</span>
                          )}
                          <span className="text-muted-foreground ml-2 text-xs">⌄</span>
                        </Button>
                      </PopoverTrigger>
                    </FormControl>

                    <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
                      <Command>
                        <CommandInput placeholder={t('dashboard.category.filterText')} />

                        <CommandList>
                          <CommandEmpty>{t('public.noResultText')}</CommandEmpty>

                          <CommandGroup>
                            {categories?.map((cat) => (
                              <CommandItem
                                key={cat.id}
                                value={String(cat.id)}
                                onSelect={() => {
                                  field.onChange(cat.id)
                                  setOpen(false)
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="h-6 w-6 rounded object-cover" />
                                  ) : (
                                    <Avatar className="h-6 w-6 rounded object-cover">
                                      <AvatarFallback className="rounded object-cover">{getInitials(cat.name)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <span>{cat.name}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                {t('dashboard.product.description')}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder={t('dashboard.product.descriptionPlaceholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
