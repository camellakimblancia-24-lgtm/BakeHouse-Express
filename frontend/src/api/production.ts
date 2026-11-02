import { getProducts, recordEvent, saveProducts } from './counter'
import { logBatch } from './recipes'
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