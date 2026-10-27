export interface Product {
  id: number
  recipeId: number
  name: string
  price: number
  stock: number
}

export interface SaleLine {
  productId: number
  name: string
  qty: number
  price: number
}

export interface Sale {
  id: number
  date: string
  lines: SaleLine[]
  total: number
}

export type WasteReason = 'Unsold' | 'Stale' | 'Damaged'

export interface WasteEntry {
  id: number
  date: string
  productName: string
  qty: number
  reason: WasteReason
}