'use client'

import { AvatarUpload } from '@/components/avatar-upload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Switch } from '@/components/ui/switch'
import { useCreateUser, useUpdateUser } from '@/hooks/use-user'
import { userCreateSchema, type UserForm, userUpdateSchema } from '@/schemas/user-schema'
import type { User } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: User
}

export function UserForm({ open, onOpenChange, currentRow }: UserFormProps) {
  const { t } = useTranslation()
  const isEdit = !!currentRow
  const schema = isEdit ? userUpdateSchema : userCreateSchema
  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const isSubmitting = isCreating || isUpdating

  const form = useForm<UserForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: null,
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone_number: '',
      status: true,
      isEdit: !!currentRow,
      ...(currentRow
        ? {
            ...currentRow,
            avatar: typeof currentRow.avatar === 'string' ? null : currentRow.avatar,
            password: '',
            confirmPassword: '',
            status: Boolean(currentRow.status)
          }
        : {})
    }
  })

  const onSubmit = (values: UserForm) => {
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
          <form onSubmit={form.handleSubmit(onSubmit)} id="user-form" className="space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle>
                {isEdit ? t('public.editText') : t('public.createText')} {t('dashboard.user.title')}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? t('dashboard.user.editDesc') : t('dashboard.user.createDesc')} {t('public.saveDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="-mr-4 h-[26.25rem] w-full space-y-4 overflow-y-auto py-1 pr-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <AvatarUpload value={field.value ?? null} onChange={field.onChange} currentAvatar={typeof currentRow?.avatar === 'string' ? currentRow.avatar : undefined} />
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
                      <FormLabel>Name</FormLabel>
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} value={field.value ?? ''} />
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
                        <FormLabel>Status</FormLabel>
                        <p className="text-muted-foreground text-sm">Whether the user is active or not</p>
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
