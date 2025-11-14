import type { Category } from './category'

export interface Product {
  id: number
  category_id: number
  slug: string
  sku: string
  name: string
  category: Category
  description: string
  dimensions: Dimensions
  status: boolean | number
  use_variant: boolean
  created_by: string | null
  images: string[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  informations: ProductInformation[]
  tags?: string[] | undefined
  created_at: string
  updated_at: string
}

export interface Dimensions {
  weight: number
  height: number | null
  width: number | null
  length: number | null
}

export interface ProductVariant {
  id: number
  name: string
  price: number
  stock: number
  sold: number
  image: string | null
}

export interface ProductAttribute {
  id: number
  name: string
  lists: string[]
}

export interface ProductInformation {
  id: number
  name: string
  description: string
}
