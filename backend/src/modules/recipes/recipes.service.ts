import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import { convert } from '../../lib/units.js'

type Item = { ingredient_id: string; quantity: number; unit: string }
type RecipeInput = {
  name: string
  description?: string
  servings: number
  instructions?: string
  ingredients: Item[]
}

const SELECT = '*, recipe_ingredients(id, ingredient_id, quantity, unit, ingredients(name))'

export async function listRecipes(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('recipes').select(SELECT).order('name')
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function getRecipe(token: string, id: string) {
  const { data, error } = await supabaseForUser(token)
    .from('recipes').select(SELECT).eq('id', id).single()
  if (error || !data) throw new AppError(404, 'Recipe not found', 'NOT_FOUND')
  return data
}

export async function createRecipe(token: string, input: RecipeInput) {
  const db = supabaseForUser(token)
  const { ingredients, ...fields } = input

  const { data: recipe, error } = await db
    .from('recipes').insert(fields).select().single()
  if (error) throw new AppError(400, error.message, 'CREATE_FAILED')

  if (ingredients.length) {
    const rows = ingredients.map((i) => ({ ...i, recipe_id: recipe.id }))
    const { error: itemsError } = await db.from('recipe_ingredients').insert(rows)
    if (itemsError) {
      await db.from('recipes').delete().eq('id', recipe.id)
      throw new AppError(400, itemsError.message, 'CREATE_FAILED')
    }
  }
  return getRecipe(token, recipe.id)
}

export async function updateRecipe(token: string, id: string, input: Partial<RecipeInput>) {
  const db = supabaseForUser(token)
  const { ingredients, ...fields } = input

  if (Object.keys(fields).length) {
    const { error } = await db.from('recipes').update(fields).eq('id', id)
    if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  }

  if (ingredients) {
    const { error: delError } = await db
      .from('recipe_ingredients').delete().eq('recipe_id', id)
    if (delError) throw new AppError(400, delError.message, 'UPDATE_FAILED')

    if (ingredients.length) {
      const rows = ingredients.map((i) => ({ ...i, recipe_id: id }))
      const { error: insError } = await db.from('recipe_ingredients').insert(rows)
      if (insError) throw new AppError(400, insError.message, 'UPDATE_FAILED')
    }
  }
  return getRecipe(token, id)
}

export async function deleteRecipe(token: string, id: string) {
  const { error } = await supabaseForUser(token)
    .from('recipes').delete().eq('id', id)
  if (error) throw new AppError(400, error.message, 'DELETE_FAILED')
}

export async function getRecipeCost(token: string, id: string) {
  const { data, error } = await supabaseForUser(token)
    .from('recipes')
    .select('id, name, servings, recipe_ingredients(quantity, unit, ingredients(name, unit, cost_per_unit))')
    .eq('id', id)
    .single()
  if (error || !data) throw new AppError(404, 'Recipe not found', 'NOT_FOUND')

  const recipe: any = data
  const items: any[] = recipe.recipe_ingredients ?? []
  if (!items.length)
    throw new AppError(400, 'Recipe has no ingredients', 'NO_INGREDIENTS')

  const lines = items.map((item) => {
    const ing = item.ingredients
    const qty = convert(Number(item.quantity), item.unit, ing.unit)
    if (qty === null)
      throw new AppError(
        400,
        `Cannot convert ${item.unit} to ${ing.unit} for ${ing.name}`,
        'UNIT_MISMATCH'
      )
    const cost = qty * Number(ing.cost_per_unit)
    return { ingredient: ing.name, quantity: item.quantity, unit: item.unit, cost: Number(cost.toFixed(2)) }
  })

  const total = lines.reduce((sum, l) => sum + l.cost, 0)
  return {
    recipe_id: recipe.id,
    name: recipe.name,
    servings: recipe.servings,
    total_cost: Number(total.toFixed(2)),
    cost_per_serving: Number((total / recipe.servings).toFixed(2)),
    lines,
  }
}