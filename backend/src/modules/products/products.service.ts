import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'

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