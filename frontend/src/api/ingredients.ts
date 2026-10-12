import type { Ingredient } from '../types/ingredients'

let ingredients: Ingredient[] = [
  { id: 1, name: 'Butter', category: 'DAIRY', unit: 'kg', quantity: 4, reorder_level: 5 },
  { id: 2, name: 'Milk', category: 'DAIRY', unit: 'L', quantity: 12, reorder_level: 6 },
  { id: 3, name: 'Flour', category: 'DRY_GOODS', unit: 'kg', quantity: 30, reorder_level: 10 },
  { id: 4, name: 'Sugar', category: 'DRY_GOODS', unit: 'kg', quantity: 0, reorder_level: 8 },
  { id: 5, name: 'Apples', category: 'PRODUCE', unit: 'kg', quantity: 6, reorder_level: 4 },
  { id: 6, name: 'Cake box', category: 'PACKAGING', unit: 'pcs', quantity: 40, reorder_level: 50 },
]

export async function getIngredients(): Promise<Ingredient[]> {
  return [...ingredients]
}

export async function addIngredient(data: Omit<Ingredient, 'id'>) {
  ingredients = [...ingredients, { ...data, id: Date.now() }]
}

export async function adjustStock(id: number, change: number) {
  ingredients = ingredients.map((i) =>
    i.id === id ? { ...i, quantity: Math.max(0, i.quantity + change) } : i
  )
}