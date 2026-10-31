import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import { deductStockForOrder } from '../inventory/inventory.service.js'

type OrderInput = {
  customer_name: string
  notes?: string
  items: { product_id: string; quantity: number }[]
}

type OrderUpdate = {
  customer_name?: string
  notes?: string
  status?: string
}

const SELECT = '*, order_items(id, product_id, quantity, unit_price, products(name))'

export async function listOrders(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('orders').select(SELECT).order('created_at', { ascending: false })
  if (error) throw new AppError(400, error.message, 'FETCH_FAILED')
  return data
}

export async function getOrder(token: string, id: string) {
  const { data, error } = await supabaseForUser(token)
    .from('orders').select(SELECT).eq('id', id).single()
  if (error || !data) throw new AppError(404, 'Order not found', 'NOT_FOUND')
  return data
}

export async function createOrder(token: string, input: OrderInput) {
  const db = supabaseForUser(token)
  const { items, ...fields } = input

  const ids = [...new Set(items.map((i) => i.product_id))]
  const { data: products, error: prodError } = await db
    .from('products').select('id, price, is_available').in('id', ids)
  if (prodError) throw new AppError(400, prodError.message, 'CREATE_FAILED')
  if (!products || products.length !== ids.length)
    throw new AppError(400, 'One or more products were not found', 'PRODUCT_NOT_FOUND')
  if (products.some((p) => !p.is_available))
    throw new AppError(400, 'One or more products are unavailable', 'PRODUCT_UNAVAILABLE')

  const priceOf = new Map(products.map((p) => [p.id, Number(p.price)]))
  const rows = items.map((i) => ({
    product_id: i.product_id,
    quantity: i.quantity,
    unit_price: priceOf.get(i.product_id)!,
  }))
  const total = rows.reduce((sum, r) => sum + r.unit_price * r.quantity, 0)

  const { data: order, error } = await db
    .from('orders').insert({ ...fields, total }).select().single()
  if (error) throw new AppError(400, error.message, 'CREATE_FAILED')

  const { error: itemsError } = await db
    .from('order_items').insert(rows.map((r) => ({ ...r, order_id: order.id })))
  if (itemsError) {
    await db.from('orders').delete().eq('id', order.id)
    throw new AppError(400, itemsError.message, 'CREATE_FAILED')
  }
  return getOrder(token, order.id)
}

export async function updateOrder(token: string, id: string, input: OrderUpdate) {
  const { error } = await supabaseForUser(token)
    .from('orders').update(input).eq('id', id)
  if (error) throw new AppError(400, error.message, 'UPDATE_FAILED')
  return getOrder(token, id)
}

export async function deleteOrder(token: string, id: string) {
  const { error } = await supabaseForUser(token)
    .from('orders').delete().eq('id', id)
  if (error) throw new AppError(400, error.message, 'DELETE_FAILED')
}