import { getProducts, recordEvent, saveProducts } from './counter'
import { getRecipes } from './recipes'
import { addLog } from './logs'

export async function addToCounter(recipeId: number, batches: number, user = 'Baker'): Promise<number> {
  if (batches <= 0) throw new Error('Batches must be above 0.')

  const recipes = await getRecipes()
  const recipe = recipes.find((r) => r.id === recipeId)
  if (!recipe) throw new Error('Recipe not found.')

  const products = await getProducts()
  const product = products.find((p) => p.recipeId === recipeId)
  if (!product) throw new Error('No counter product for this recipe.')

  const produced = recipe.yieldPerBatch * batches
  saveProducts(products.map((p) => (p.id === product.id ? { ...p, stock: p.stock + produced } : p)))
  recordEvent('bake', product.id, produced)

  await addLog({
    type: 'batch',
    description: `Baked ${batches} ${batches === 1 ? 'batch' : 'batches'} of ${recipe.name}`,
    user,
    change: `+${produced} ${recipe.yieldLabel} on counter`,
  })
  return produced
}