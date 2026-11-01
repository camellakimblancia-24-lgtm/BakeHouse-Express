import { getProducts, recordEvent, saveProducts } from './counter'
import { addLog } from './logs'
import type { Sale, SaleLine } from '../types/counter'

const SALES_KEY = 'bakehouse-sales'

function readSales(): Sale[] {
  try {
    const raw = localStorage.getItem(SALES_KEY)
    if (raw) return JSON.parse(raw) as Sale[]
  } catch {
    // start empty if the saved data is unreadable
  }
  return []
}

export async function getSales(): Promise<Sale[]> {
  return readSales().sort((a, b) => b.date.localeCompare(a.date))
}

export async function checkout(
  cart: { productId: number; qty: number }[],
  user = 'Counter',
): Promise<Sale> {
  const wanted = new Map<number, number>()
  for (const item of cart) {
    if (item.qty > 0) wanted.set(item.productId, (wanted.get(item.productId) ?? 0) + item.qty)
  }
  if (wanted.size === 0) throw new Error('The order is empty.')

  const products = await getProducts()
  const lines: SaleLine[] = []

  for (const [productId, qty] of wanted) {
    const product = products.find((p) => p.id === productId)
    if (!product) throw new Error('A product in this order no longer exists.')
    if (qty > product.stock) {
      throw new Error(`Not enough ${product.name} (only ${product.stock} left).`)
    }
    lines.push({ productId: product.id, name: product.name, qty, price: product.price })
  }

  saveProducts(
    products.map((p) => {
      const line = lines.find((l) => l.productId === p.id)
      return line ? { ...p, stock: p.stock - line.qty } : p
    }),
  )
  lines.forEach((l) => recordEvent('sale', l.productId, l.qty, l.qty * l.price))

  const sales = readSales()
  const sale: Sale = {
    id: Math.max(0, ...sales.map((s) => s.id)) + 1,
    date: new Date().toISOString(),
    lines,
    total: lines.reduce((sum, l) => sum + l.qty * l.price, 0),
  }
  localStorage.setItem(SALES_KEY, JSON.stringify([sale, ...sales]))

  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0)
  await addLog({
    type: 'sale',
    description: `Sold ${lines.map((l) => `${l.qty} ${l.name}`).join(', ')}`,
    user,
    change: `-${totalQty} pcs`,
  })
  return sale
}