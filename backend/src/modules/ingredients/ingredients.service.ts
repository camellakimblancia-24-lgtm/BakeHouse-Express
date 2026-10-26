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