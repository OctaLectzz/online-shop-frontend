import { Input } from '@/components/ui/input'
import { forwardRef } from 'react'

interface RestrictedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  lowercase?: boolean
  noSpaces?: boolean
}

/**
 * Reusable input for:
 * - remove uppercase
 * - remove space
 * - trim
 */
export const RestrictedInput = forwardRef<HTMLInputElement, RestrictedInputProps>(({ lowercase = true, noSpaces = true, onChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (lowercase) {
      value = value.toLowerCase()
    }

    if (noSpaces) {
      value = value.replace(/\s+/g, '')
    }

    // override value in event
    e.target.value = value

    onChange?.(e)
  }

  return <Input ref={ref} {...props} onChange={handleChange} />
})

RestrictedInput.displayName = 'RestrictedInput'
