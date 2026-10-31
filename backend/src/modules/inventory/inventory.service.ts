import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import { convert } from '../../lib/units.js'

type Movement = {
  ingredient_id: string
  type: 'restock' | 'usage' | 'adjustment'
  quantity: number
  note?: string
  supplier_id?: string
}

type Settings = { reorder_level?: number; supplier_id?: string | null }

const SELECT = '*, suppliers(name)'

export async function listStock(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('ingredients').select(SELECT).order('name')
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data.map((i: any) => ({
    ...i,
    is_low: Number(i.quantity) <= Number(i.reorder_level),
  }))
}

export async function listLowStock(token: string) {
  const all = await listStock(token)
  return all.filter((i: any) => i.is_low)
}

export async function listMovements(token: string, ingredientId?: string) {
  let query = supabaseForUser(token)
    .from('stock_movements')
    .select('*, ingredients(name), suppliers(name)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (ingredientId) query = query.eq('ingredient_id', ingredientId)

  const { data, error } = await query
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function recordMovement(token: string, input: Movement) {
  const { data, error } = await supabaseForUser(token).rpc('record_stock_movement', {
    p_ingredient_id: input.ingredient_id,
    p_type: input.type,
    p_quantity: input.quantity,
    p_note: input.note ?? null,
    p_supplier_id: input.supplier_id ?? null,
  })
  if (error) {
    if (error.message.includes('Not enough stock'))
      throw new AppError(400, 'Not enough stock', 'INSUFFICIENT_STOCK')
    if (error.message.includes('Ingredient not found'))
      throw new AppError(404, 'Ingredient not found', 'NOT_FOUND')
    throw new AppError(400, error.message, 'MOVEMENT_FAILED')
  }
  return data
}

export async function updateSettings(token: string, id: string, input: Settings) {
  const { data, error } = await supabaseForUser(token)
    .from('ingredients').update(input).eq('id', id).select(SELECT).single()
  if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  return data
}

export async function deductStockForOrder(token: string, orderId: string) {
  const db = supabaseForUser(token)

  const { data, error } = await db
    .from('order_items')
    .select(
      'quantity, products(name, recipes(recipe_ingredients(ingredient_id, quantity, unit, ingredients(name, unit, quantity))))'
    )
    .eq('order_id', orderId)
  if (error) throw new AppError(400, error.message, 'DEDUCT_FAILED')
  if (!data || !data.length) throw new AppError(404, 'Order has no items', 'NOT_FOUND')

  const needs = new Map<string, { name: string; unit: string; stock: number; needed: number }>()

  for (const row of data as any[]) {
    const recipe = row.products?.recipes
    if (!recipe) continue
    for (const ri of recipe.recipe_ingredients ?? []) {
      const ing = ri.ingredients
      const qty = convert(Number(ri.quantity) * Number(row.quantity), ri.unit, ing.unit)
      if (qty === null)
        throw new AppError(
          400,
          `Cannot convert ${ri.unit} to ${ing.unit} for ${ing.name}`,
          'UNIT_MISMATCH'
        )
      const current = needs.get(ri.ingredient_id)
      if (current) current.needed += qty
      else
        needs.set(ri.ingredient_id, {
          name: ing.name,
          unit: ing.unit,
          stock: Number(ing.quantity),
          needed: qty,
        })
    }
  }

  const short = [...needs.values()].filter((n) => n.needed > n.stock)
  if (short.length)
    throw new AppError(
      400,
      `Not enough stock: ${short.map((s) => `${s.name} (need ${s.needed}${s.unit}, have ${s.stock}${s.unit})`).join(', ')}`,
      'INSUFFICIENT_STOCK'
    )

  const deducted = []
  for (const [ingredientId, n] of needs) {
    const { error: rpcError } = await db.rpc('record_stock_movement', {
      p_ingredient_id: ingredientId,
      p_type: 'usage',
      p_quantity: n.needed,
      p_note: `Order ${orderId}`,
      p_supplier_id: null,
    })
    if (rpcError) throw new AppError(400, rpcError.message, 'DEDUCT_FAILED')
    deducted.push({ ingredient: n.name, used: n.needed, unit: n.unit })
  }

  return { order_id: orderId, deducted }
}