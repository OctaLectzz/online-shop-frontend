'use client'

import { ImageUpload } from '@/components/image/image-upload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { RestrictedInput } from '@/components/ui/restricted-input'
import { Switch } from '@/components/ui/switch'
import { useCreateUser, useUpdateUser } from '@/hooks/use-user'
import { userCreateSchema, userUpdateSchema, type UserFormValues } from '@/schemas/user-schema'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: User
}

export function UserForm({ open, onOpenChange, currentRow }: UserFormProps) {
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  const { t } = useTranslation()
  const isEdit = !!currentRow
  const schema = isEdit ? userUpdateSchema : userCreateSchema
  const isSubmitting = isCreating || isUpdating

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: null,
      name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      phone_number: '',
      status: true,
      isEdit: !!currentRow,
      ...(currentRow
        ? {
            ...currentRow,
            avatar: typeof currentRow.avatar === 'string' ? null : currentRow.avatar,
            password: '',
            confirm_password: '',
            status: Boolean(currentRow.status)
          }
        : {})
    }
  })

  const onSubmit = (values: UserFormValues) => {
    if (isEdit && currentRow?.id) {
      updateUser(
        { ...values, id: currentRow.id },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          }
        }
      )
    } else {
      createUser(values, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        }
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="user-form" className="space-y-6">
            <DialogHeader className="text-left">
              <DialogTitle>
                {isEdit ? t('public.editText') : t('public.createText')} {t('dashboard.user.title')}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? t('dashboard.user.editDesc') : t('dashboard.user.createDesc')} {t('public.saveDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="w-full space-y-6 overflow-y-auto py-1">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <ImageUpload value={field.value ?? null} onChange={field.onChange} currentImage={typeof currentRow?.avatar === 'string' ? currentRow.avatar : undefined} shape="round" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.user.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.user.username')}</FormLabel>
                      <FormControl>
                        <RestrictedInput placeholder="johndoe" {...field} lowercase noSpaces />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.user.email')}</FormLabel>
                    <FormControl>
                      <RestrictedInput placeholder="john@example.com" {...field} lowercase noSpaces />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.user.password')}</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.user.confirmPassword')}</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.user.phoneNumber')}</FormLabel>
                      <FormControl>
                        <Input placeholder="+6281234567890" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>{t('dashboard.user.status')}</FormLabel>
                        <p className="text-muted-foreground text-sm">{t('dashboard.user.statusDesc')}</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" form="user-form" disabled={isSubmitting}>
                {isSubmitting ? t('public.loadingText') : t('public.saveText')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
