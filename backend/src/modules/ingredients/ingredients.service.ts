import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'

export async function listIngredients(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('ingredients').select('*').order('name')
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function createIngredient(
  token: string,
  input: { name: string; quantity: number; unit: string }
) {
  const { data, error } = await supabaseForUser(token)
    .from('ingredients').insert(input).select().single()
  if (error) throw new AppError(400, error.message, 'CREATE_FAILED')
  return data
}

export async function updateIngredient(
  token: string,
  id: string,
  input: { name?: string; quantity?: number; unit?: string }
) {
  const { data, error } = await supabaseForUser(token)
    .from('ingredients').update(input).eq('id', id).select().single()
  if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  return data
}

export async function deleteIngredient(token: string, id: string) {
  const { error } = await supabaseForUser(token)
    .from('ingredients').delete().eq('id', id)
  if (error) throw new AppError(400, error.message, 'DELETE_FAILED')
}