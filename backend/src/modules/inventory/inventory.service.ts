import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'

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