import { getProducts, recordEvent, saveProducts } from './counter'
import { deleteRecipeRecord, getRecipes, logBatch } from './recipes'
import { addLog } from './logs'
import type { Recipe } from '../types/recipe'

export async function bakeBatch(recipe: Recipe, batches: number, baker: string): Promise<number> {
  const products = await getProducts()
  const product = products.find((p) => p.recipeId === recipe.id)
  if (!product) throw new Error('No counter product for this recipe.')

  await logBatch(recipe, batches, baker)

  const produced = recipe.yieldPerBatch * batches
  saveProducts(products.map((p) => (p.id === product.id ? { ...p, stock: p.stock + produced } : p)))
  recordEvent('bake', product.id, produced)

  await addLog({
    type: 'batch',
    description: `Baked ${batches} ${batches === 1 ? 'batch' : 'batches'} of ${recipe.name}`,
    user: baker,
    change: `+${produced} ${recipe.yieldLabel} on counter`,
  })
  return produced
}

export async function removeRecipe(recipeId: number): Promise<void> {
  const recipes = await getRecipes()
  const recipe = recipes.find((r) => r.id === recipeId)
  if (!recipe) throw new Error('Recipe not found.')

  const products = await getProducts()
  const product = products.find((p) => p.recipeId === recipeId)
  if (product && product.stock > 0) {
    throw new Error(
      `${product.stock} ${recipe.name} are still on the display counter. Sell them or log them as waste first.`,
    )
  }

  if (product) saveProducts(products.filter((p) => p.id !== product.id))
  await deleteRecipeRecord(recipeId)
}