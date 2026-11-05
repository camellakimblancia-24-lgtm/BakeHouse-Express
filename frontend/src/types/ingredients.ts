export type Category = 'DAIRY' | 'DRY_GOODS' | 'PRODUCE' | 'PACKAGING'

export interface Ingredient {
  id: string | number
  name: string
  category: Category
  unit: string
  quantity: number
  reorder_level: number
  cost_per_unit: number
}