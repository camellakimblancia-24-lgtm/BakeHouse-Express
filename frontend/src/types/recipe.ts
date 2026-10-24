export interface RecipeItem {
  ingredientId: number
  quantity: number // per 1 batch, in the ingredient's unit
}

export interface Recipe {
  id: number
  name: string
  yieldPerBatch: number
  items: RecipeItem[]
}

export interface BatchLog {
  id: number
  date: string
  baker: string
  recipeName: string
  batches: number
}