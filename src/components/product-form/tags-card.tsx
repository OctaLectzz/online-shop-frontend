import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductFormValues } from '@/schemas/product-schema'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface TagsProps {
  form: UseFormReturn<ProductFormValues>
}

export function ProductTagsCard({ form }: TagsProps) {
  const { t } = useTranslation()
  const [currentTag, setCurrentTag] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{t('dashboard.product.tagsTitle')}</CardTitle>
      </CardHeader>

      <CardContent className="w-full space-y-4 py-1">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            const rawValue = (field.value ?? []) as (string | undefined)[]
            const tags: string[] = rawValue.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)

            const handleAddTag = () => {
              const trimmed = currentTag.trim()
              if (!trimmed) return

              if (tags.includes(trimmed)) {
                setCurrentTag('')
                return
              }

              const nextTags: string[] = [...tags, trimmed]
              field.onChange(nextTags)
              setCurrentTag('')
            }

            const handleRemoveTag = (index: number) => {
              const nextTags = tags.filter((_, i) => i !== index)
              field.onChange(nextTags)
            }

            return (
              <FormItem>
                <FormLabel className="gap-1">{t('dashboard.product.tags')}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={t('dashboard.product.tagPlaceholder')}
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                </FormControl>

                <FormMessage />

                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={`${tag}-${index}`} variant="outline" className="flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" className="text-xs leading-none" onClick={() => handleRemoveTag(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}
