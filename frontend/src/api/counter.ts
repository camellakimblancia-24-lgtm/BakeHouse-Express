import { getRecipes } from './recipes'
import { addLog } from './logs'
import type { RecipeCategory } from '../types/recipe'
import type { Product, WasteEntry, WasteReason } from '../types/counter'

export interface CounterProduct extends Product {
  category: RecipeCategory
  image?: string
  shelfLifeMinutes: number
  bakedToday: number
  soldToday: number
  wasteToday: number
}

export interface CounterMetrics {
  available: number
  sold: number
  revenue: number
  baked: number
}

export interface CounterOverview {
  products: CounterProduct[]
  metrics: CounterMetrics
}

type EventType = 'bake' | 'sale' | 'waste'

interface CounterEvent {
  id: number
  date: string
  type: EventType
  productId: number
  qty: number
  amount: number
}

const PRODUCTS_KEY = 'bakehouse-products'
const EVENTS_KEY = 'bakehouse-counter-events'
const WASTE_KEY = 'bakehouse-waste'

const DEFAULT_PRICE: Record<RecipeCategory, number> = { BREAD: 65, COOKIES: 80, PASTRIES: 90, CAKES: 950 }
const SHELF_LIFE: Record<RecipeCategory, number> = { BREAD: 240, COOKIES: 480, PASTRIES: 180, CAKES: 7 }

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
  } catch {
    return []
  }
  return []
}

function write<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list))
}

function nextId(list: { id: number }[]) {
  return Math.max(0, ...list.map((item) => item.id)) + 1
}

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

export function saveProducts(products: Product[]) {
  write(PRODUCTS_KEY, products)
}

export function recordEvent(type: EventType, productId: number, qty: number, amount = 0) {
  const events = read<CounterEvent>(EVENTS_KEY)
  const event: CounterEvent = {
    id: nextId(events),
    date: new Date().toISOString(),
    type,
    productId,
    qty,
    amount,
  }
  write(EVENTS_KEY, [event, ...events])
}

export async function getProducts(): Promise<Product[]> {
  const recipes = await getRecipes()
  const savedProducts = read<Product>(PRODUCTS_KEY)
  const stored = savedProducts.filter((p) => recipes.some((r) => r.id === p.recipeId))

  const missing = recipes.filter((r) => !stored.some((p) => p.recipeId === r.id))
  if (missing.length === 0 && stored.length === savedProducts.length) return stored

  let id = nextId(savedProducts)
  const added: Product[] = missing.map((r) => ({
    id: id++,
    recipeId: r.id,
    name: r.name,
    price: DEFAULT_PRICE[r.category] ?? 65,
    stock: 0,
  }))

  const all = [...stored, ...added]
  saveProducts(all)
  return all
}

export async function getCounterOverview(): Promise<CounterOverview> {
  const [base, recipes] = await Promise.all([getProducts(), getRecipes()])
  const today = read<CounterEvent>(EVENTS_KEY).filter((e) => isToday(e.date))

  const total = (type: EventType, productId: number) =>
    today
      .filter((e) => e.type === type && e.productId === productId)
      .reduce((sum, e) => sum + e.qty, 0)

  const products: CounterProduct[] = base.map((p) => {
    const recipe = recipes.find((r) => r.id === p.recipeId)
    const category = recipe?.category ?? 'BREAD'
    return {
      ...p,
      category,
      image: recipe?.image,
      shelfLifeMinutes: SHELF_LIFE[category],
      bakedToday: total('bake', p.id),
      soldToday: total('sale', p.id),
      wasteToday: total('waste', p.id),
    }
  })

  return {
    products,
    metrics: {
      available: products.reduce((sum, p) => sum + p.stock, 0),
      sold: products.reduce((sum, p) => sum + p.soldToday, 0),
      revenue: today.filter((e) => e.type === 'sale').reduce((sum, e) => sum + e.amount, 0),
      baked: products.reduce((sum, p) => sum + p.bakedToday, 0),
    },
  }
}

export async function getWaste(): Promise<WasteEntry[]> {
  return read<WasteEntry>(WASTE_KEY).sort((a, b) => b.date.localeCompare(a.date))
}

export async function logWaste(
  productId: number,
  qty: number,
  reason: WasteReason,
  user = 'Counter',
): Promise<WasteEntry> {
  const products = await getProducts()
  const product = products.find((p) => p.id === productId)
  if (!product) throw new Error('Product not found.')
  if (qty <= 0) throw new Error('Quantity must be above 0.')
  if (qty > product.stock) {
    throw new Error(`Only ${product.stock} ${product.name} left on the counter.`)
  }

  saveProducts(products.map((p) => (p.id === productId ? { ...p, stock: p.stock - qty } : p)))
  recordEvent('waste', productId, qty)

  const waste = read<WasteEntry>(WASTE_KEY)
  const entry: WasteEntry = {
    id: nextId(waste),
    date: new Date().toISOString(),
    productName: product.name,
    qty,
    reason,
  }
  write(WASTE_KEY, [entry, ...waste])

  await addLog({
    type: 'waste',
    description: `Removed ${qty} ${product.name} (${reason})`,
    user,
    change: `-${qty} pcs`,
  })
  return entry
}