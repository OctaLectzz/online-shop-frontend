export interface Address {
  id: number
  user_id: number
  recipient_name: string
  phone_number: string
  province_id: number
  province_name: string
  city_id: number
  city_name: string
  district_id: number | null
  district_name: string | null
  village_id: number | null
  village_name: string | null
  postal_code: string
  address: string
  label: 'house' | 'office' | 'etc'
  notes: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  slug: string
  image: string | null
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: number
  name: string
  created_at: string
}

export interface Product {
  id: number
  slug: string
  sku: string
  name: string
  category: string | null
  description: string
  price: number
  stock: number
  dimensions: {
    weight: number | null
    height: number | null
    width: number | null
    length: number | null
  }
  status: boolean
  sold: number
  created_by: string | null
  images: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  product_id: number
  user_id: number
  user: User
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

export interface Promo {
  id: number
  promo_code: string
  name: string
  description: string | null
  discount_type: 'percent' | 'nominal'
  discount_value: number
  max_discount_amount: number | null
  quota: number | null
  usage_count: number
  valid_from: string
  valid_until: string
  status: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Cart {
  id: number
  user_id: number
  product_id: number
  product: Product
  quantity: number
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  image: string
  name: string
  type: 'bank' | 'ewallet' | 'qris' | 'cash'
  account_number: string | null
  account_name: string | null
  tutorial: string | null
  status: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  product_id: number
  product: Product
  quantity: number
  unit_price: number
  total_price: number
}
export interface Order {
  id: number
  invoice: string
  user_id: number
  promo_id: number | null
  user: User
  promo: Promo | null
  total_price: number
  discount_value: number | null
  subtotal_price: number
  note: string | null
  order_date: string
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'refunded'
  items: OrderItem[]
  created_at: string
}

export interface Pay {
  id: number
  order_id: number
  payment_id: number
  order: Order
  payment: Payment
  transfer_date: string
  transfer_amount: number
  transfer_proof: string
  validation_status: 'pending' | 'accepted' | 'rejected'
  admin_notes: string | null
  validated_by: string | null
  created_at: string
}

export interface Shipment {
  id: number
  order_id: number
  order: Order
  shipping_date: string
  shipping_service: string
  courier_name: string | null
  shipping_estimation: string | null
  shipping_description: string | null
  tracking_number: string
  processed_by: string | null
  created_at: string
}

export interface Faq {
  id: number
  question: string
  answer: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  email: string | null
  phone_number: string | null
  address: string | null
  maps: string | null
  whatsapp: string | null
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  twitter: string | null
  linkedin: string | null
  created_at: string
  updated_at: string
}

export type Settings = Record<string, string | null>

import type { User } from '@/types/user'

export interface Log {
  id: number
  user_id: number
  user: User
  action: string
  description: string | null
  reference_type: string
  reference_id: number
  read: boolean
  created_at: string
}

export interface ApiResponse<T> {
  data: T
}

export type APIErrorResponse = {
  message: string
  errors?: Record<string, string[]>
}
