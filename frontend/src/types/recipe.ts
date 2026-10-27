export type RecipeCategory = 'BREAD' | 'COOKIES' | 'PASTRIES'

export interface RecipeItem {
  ingredientId: number
  quantity: number // per 1 batch, in the ingredient's unit
}

export interface Recipe {
  id: number
  name: string
  category: RecipeCategory
  bakeMinutes: number
  description: string
  image?: string
  yieldPerBatch: number
  yieldLabel: string
  items: RecipeItem[]
}

export interface BatchLog {
  id: number
  date: string
  baker: string
  recipeName: string
  batches: number
}