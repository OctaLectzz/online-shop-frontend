import type { Category } from './category'

export interface Product {
  id: number
  category_id: number
  sku: string
  slug: string
  name: string
  category: Category
  description: string
  weight: number
  height: number | null
  width: number | null
  length: number | null
  status: boolean
  use_variant: boolean
  created_by: string | null
  images: string[]
  variants: ProductVariant[]
  attributes: ProductAttribute[]
  informations: ProductInformation[]
  tags: string[] | undefined
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  name: string
  price: number
  stock: number
  sold: number | null
  image: string | null
  _delete?: boolean
}

export interface ProductAttribute {
  id: number
  name: string
  lists: string[]
  _delete?: boolean
}

export interface ProductInformation {
  id: number
  name: string
  description: string
  _delete?: boolean
}
