import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'

type SupplierInput = {
  name?: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
}

export async function listSuppliers(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('suppliers').select('*').order('name')
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function getSupplier(token: string, id: string) {
  const { data, error } = await supabaseForUser(token)
    .from('suppliers').select('*').eq('id', id).single()
  if (error || !data) throw new AppError(404, 'Supplier not found', 'NOT_FOUND')
  return data
}

export async function createSupplier(token: string, input: SupplierInput) {
  const { data, error } = await supabaseForUser(token)
    .from('suppliers').insert(input).select().single()
  if (error) throw new AppError(400, error.message, 'CREATE_FAILED')
  return data
}

export async function updateSupplier(token: string, id: string, input: SupplierInput) {
  const { data, error } = await supabaseForUser(token)
    .from('suppliers').update(input).eq('id', id).select().single()
  if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  return data
}

export async function deleteSupplier(token: string, id: string) {
  const { error } = await supabaseForUser(token)
    .from('suppliers').delete().eq('id', id)
  if (error) throw new AppError(400, error.message, 'DELETE_FAILED')
}