import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, value = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input type={showPassword ? 'text' : 'password'} className={cn('pr-10', className)} ref={ref} value={value} {...props} />
      <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
