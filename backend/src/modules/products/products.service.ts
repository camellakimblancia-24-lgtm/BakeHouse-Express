import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import { convert } from '../../lib/units.js'


type ProductInput = {
  name?: string
  description?: string
  price?: number
  category?: string
  recipe_id?: string | null
  is_available?: boolean
}

const SELECT = '*, recipes(name)'

export async function listProducts(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('products').select(SELECT).order('name')
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function getProduct(token: string, id: string) {
  const { data, error } = await supabaseForUser(token)
    .from('products').select(SELECT).eq('id', id).single()
  if (error || !data) throw new AppError(404, 'Product not found', 'NOT_FOUND')
  return data
}

export async function createProduct(token: string, input: ProductInput) {
  const { data, error } = await supabaseForUser(token)
    .from('products').insert(input).select(SELECT).single()
  if (error) throw new AppError(400, error.message, 'CREATE_FAILED')
  return data
}

export async function updateProduct(token: string, id: string, input: ProductInput) {
  const { data, error } = await supabaseForUser(token)
    .from('products').update(input).eq('id', id).select(SELECT).single()
  if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  return data
}

export async function deleteProduct(token: string, id: string) {
  const { error } = await supabaseForUser(token)
    .from('products').delete().eq('id', id)
  if (error) throw new AppError(400, error.message, 'DELETE_FAILED')
}

export async function getCanMake(token: string, id: string) {
  const db = supabaseForUser(token)

  const { data: product, error } = await db
    .from('products').select('id, name, recipe_id').eq('id', id).single()
  if (error || !product) throw new AppError(404, 'Product not found', 'NOT_FOUND')
  if (!product.recipe_id)
    throw new AppError(400, 'Product has no linked recipe', 'NO_RECIPE')

  const { data, error: recipeError } = await db
    .from('recipes')
    .select('name, servings, recipe_ingredients(quantity, unit, ingredients(name, unit, quantity))')
    .eq('id', product.recipe_id)
    .single()
  if (recipeError || !data) throw new AppError(404, 'Recipe not found', 'NOT_FOUND')

  const recipe: any = data
  const items: any[] = recipe.recipe_ingredients ?? []
  if (!items.length)
    throw new AppError(400, 'Recipe has no ingredients', 'NO_INGREDIENTS')

  let batches = Infinity
  let limiting = ''

  for (const item of items) {
    const ing = item.ingredients
    const needed = convert(Number(item.quantity), item.unit, ing.unit)
    if (needed === null)
      throw new AppError(
        400,
        `Cannot convert ${item.unit} to ${ing.unit} for ${ing.name}`,
        'UNIT_MISMATCH'
      )
    const possible = Math.floor(Number(ing.quantity) / needed)
    if (possible < batches) {
      batches = possible
      limiting = ing.name
    }
  }

  return {
    product_id: product.id,
    product: product.name,
    recipe: recipe.name,
    batches,
    servings: batches * recipe.servings,
    limiting_ingredient: limiting,
  }
}