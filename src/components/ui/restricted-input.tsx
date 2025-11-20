import { Input } from '@/components/ui/input'
import { forwardRef } from 'react'

interface RestrictedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  lowercase?: boolean
  uppercase?: boolean
  noSpaces?: boolean
}

/**
 * Reusable input component that can:
 * - convert text to lowercase
 * - convert text to uppercase
 * - remove all spaces
 * - trim value
 *
 * NOTE:
 * If both lowercase and uppercase are enabled,
 * uppercase will take priority.
 */
export const RestrictedInput = forwardRef<HTMLInputElement, RestrictedInputProps>(({ lowercase = true, uppercase = false, noSpaces = true, onChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Convert to uppercase if enabled (takes priority)
    if (uppercase) {
      value = value.toUpperCase()
    }
    // Convert to lowercase if enabled and uppercase is not used
    else if (lowercase) {
      value = value.toLowerCase()
    }

    // Remove any whitespace characters
    if (noSpaces) {
      value = value.replace(/\s+/g, '')
    }

    e.target.value = value
    onChange?.(e)
  }

  return <Input ref={ref} {...props} onChange={handleChange} />
})

RestrictedInput.displayName = 'RestrictedInput'
