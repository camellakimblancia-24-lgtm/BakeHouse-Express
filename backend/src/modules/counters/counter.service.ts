import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import type { BakeInput, CheckoutInput, WasteInput } from './counter.schema.js'

const STATUS: Record<string, number> = {
  UNAUTHENTICATED: 401,
  PRODUCT_NOT_FOUND: 404,
  INSUFFICIENT_STOCK: 409,
  INVALID: 400,
}

function fail(error: { message: string }): never {
  const match = /^([A-Z_]+): ([\s\S]*)$/.exec(error.message)
  if (match) throw new AppError(STATUS[match[1]] ?? 400, match[2], match[1])
  throw new AppError(500, error.message, 'DB_ERROR')
}

function startOfTodayManila(): string {
  const offset = 8 * 60 * 60 * 1000
  const manila = new Date(Date.now() + offset)
  manila.setUTCHours(0, 0, 0, 0)
  return new Date(manila.getTime() - offset).toISOString()
}

const sum = (rows: { quantity: number }[]) => rows.reduce((total, r) => total + r.quantity, 0)

interface ProductRow {
  id: string
  recipe_id: string | null
  name: string
  price: number | string
  category: string | null
  stock: number
}
interface EventRow {
  product_id: string
  type: 'bake' | 'sale' | 'waste'
  quantity: number
  amount: number | string
}

export async function getOverview(token: string) {
  const db = supabaseForUser(token)
  const [productsRes, eventsRes] = await Promise.all([
    db.from('products').select('id, recipe_id, name, price, category, stock').order('name'),
    db.from('counter_events').select('product_id, type, quantity, amount').gte('created_at', startOfTodayManila()),
  ])
  if (productsRes.error) fail(productsRes.error)
  if (eventsRes.error) fail(eventsRes.error)

  const rows = (productsRes.data ?? []) as ProductRow[]
  const events = (eventsRes.data ?? []) as EventRow[]
  const total = (type: EventRow['type'], productId: string) =>
    sum(events.filter((e) => e.type === type && e.product_id === productId))

  const products = rows.map((p) => ({
    id: p.id,
    recipeId: p.recipe_id,
    name: p.name,
    price: Number(p.price),
    category: (p.category ?? 'BREAD').toUpperCase(),
    stock: p.stock,
    bakedToday: total('bake', p.id),
    soldToday: total('sale', p.id),
    wasteToday: total('waste', p.id),
  }))

  const sales = events.filter((e) => e.type === 'sale')
  return {
    products,
    metrics: {
      available: products.reduce((n, p) => n + p.stock, 0),
      sold: sum(sales),
      revenue: sales.reduce((n, e) => n + Number(e.amount), 0),
      baked: sum(events.filter((e) => e.type === 'bake')),
    },
  }
}

// counter_events!inner keeps only orders that came from the counter.
const SALE_SELECT =
  'id, created_at, total, counter_events!inner(id), order_items(product_id, quantity, unit_price, products(name))'

interface SaleRow {
  id: string
  created_at: string
  total: number | string
  order_items: {
    product_id: string
    quantity: number
    unit_price: number | string
    products: { name: string } | null
  }[]
}

function mapSale(row: SaleRow) {
  return {
    id: row.id,
    date: row.created_at,
    total: Number(row.total),
    lines: (row.order_items ?? []).map((i) => ({
      productId: i.product_id,
      name: i.products?.name ?? 'Unknown',
      qty: i.quantity,
      price: Number(i.unit_price),
    })),
  }
}

export async function getSales(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('orders')
    .select(SALE_SELECT)
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) fail(error)
  return ((data ?? []) as unknown as SaleRow[]).map(mapSale)
}

export async function checkout(token: string, input: CheckoutInput) {
  const db = supabaseForUser(token)
  const { data: orderId, error } = await db.rpc('counter_checkout', {
    p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.qty })),
  })
  if (error) fail(error)

  const { data, error: readError } = await db.from('orders').select(SALE_SELECT).eq('id', orderId).single()
  if (readError) fail(readError)
  return mapSale(data as unknown as SaleRow)
}

interface WasteRow {
  id: number
  created_at: string
  quantity: number
  reason: string
  products: { name: string } | null
}

const WASTE_SELECT = 'id, created_at, quantity, reason, products(name)'

function mapWaste(row: WasteRow) {
  return {
    id: row.id,
    date: row.created_at,
    productName: row.products?.name ?? 'Unknown',
    qty: row.quantity,
    reason: row.reason,
  }
}

export async function getWaste(token: string) {
  const { data, error } = await supabaseForUser(token)
    .from('counter_events')
    .select(WASTE_SELECT)
    .eq('type', 'waste')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) fail(error)
  return ((data ?? []) as unknown as WasteRow[]).map(mapWaste)
}

export async function logWaste(token: string, input: WasteInput) {
  const db = supabaseForUser(token)
  const { data: eventId, error } = await db.rpc('counter_log_waste', {
    p_product_id: input.productId,
    p_qty: input.qty,
    p_reason: input.reason,
  })
  if (error) fail(error)

  const { data, error: readError } = await db.from('counter_events').select(WASTE_SELECT).eq('id', eventId).single()
  if (readError) fail(readError)
  return mapWaste(data as unknown as WasteRow)
}

export async function bake(token: string, input: BakeInput) {
  const { data, error } = await supabaseForUser(token).rpc('counter_bake', {
    p_product_id: input.productId,
    p_qty: input.qty,
  })
  if (error) fail(error)
  return { productId: input.productId, stock: data as number }
}