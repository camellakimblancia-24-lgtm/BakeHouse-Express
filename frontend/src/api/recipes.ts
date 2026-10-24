import type { BatchLog, Recipe } from '../types/recipe'
import { adjustStock } from './ingredients'

let recipes: Recipe[] = [
  {
    id: 1, name: 'Chocolate Chip Cookies', yieldPerBatch: 24,
    items: [{ ingredientId: 3, quantity: 2 }, { ingredientId: 4, quantity: 1 }, { ingredientId: 1, quantity: 0.5 }],
  },
  {
    id: 2, name: 'Croissants', yieldPerBatch: 12,
    items: [{ ingredientId: 3, quantity: 1.5 }, { ingredientId: 1, quantity: 1 }, { ingredientId: 2, quantity: 0.5 }],
  },
  {
    id: 3, name: 'Apple Pie', yieldPerBatch: 8,
    items: [{ ingredientId: 3, quantity: 1 }, { ingredientId: 5, quantity: 2 }, { ingredientId: 1, quantity: 0.4 }],
  },
]

let batchLogs: BatchLog[] = []

export async function getRecipes(): Promise<Recipe[]> {
  return [...recipes]
}

export async function addRecipe(data: Omit<Recipe, 'id'>) {
  recipes = [...recipes, { ...data, id: Date.now() }]
}

export async function getBatchLogs(): Promise<BatchLog[]> {
  return [...batchLogs]
}

export async function logBatch(recipe: Recipe, batches: number, baker: string) {
  // the real backend will do this deduction itself
  for (const item of recipe.items) {
    await adjustStock(item.ingredientId, -Math.round(item.quantity * batches * 100) / 100)
  }
  batchLogs = [
    { id: Date.now(), date: new Date().toLocaleString(), baker, recipeName: recipe.name, batches },
    ...batchLogs,
  ]
}