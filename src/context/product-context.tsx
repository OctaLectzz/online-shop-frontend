import useDialogState from '@/hooks/use-dialog-state'
import type { Product } from '@/types/product'
import React, { useState } from 'react'

type ProductDialogType = 'invite' | 'add' | 'edit' | 'delete'

interface ProductContextType {
  open: ProductDialogType | null
  setOpen: (str: ProductDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductContext = React.createContext<ProductContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProductProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProductDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return <ProductContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</ProductContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProduct = () => {
  const productsContext = React.useContext(ProductContext)

  if (!productsContext) {
    throw new Error('useProduct has to be used within <ProductContext>')
  }

  return productsContext
}
