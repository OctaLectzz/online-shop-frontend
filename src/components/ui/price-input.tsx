import { Input } from '@/components/ui/input'
import * as React from 'react'

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: number
  onChange?: (value: number) => void
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(({ value, onChange, ...props }, ref) => {
  const numericValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0

  // format rupiah: 39000000 -> "39.000.000"
  const displayValue =
    numericValue > 0
      ? new Intl.NumberFormat('id-ID', {
          maximumFractionDigits: 0
        }).format(numericValue)
      : ''

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value

    const digits = raw.replace(/\D/g, '')

    const nextValue = digits ? parseInt(digits, 10) : 0

    onChange?.(nextValue)
  }

  return <Input ref={ref} type="text" inputMode="numeric" value={displayValue} onChange={handleChange} {...props} />
})

PriceInput.displayName = 'PriceInput'
