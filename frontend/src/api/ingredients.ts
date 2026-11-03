import type { Ingredient } from '../types/ingredients'
import { addLog } from './logs'

const KEY = 'bakehouse-ingredients'

const seed: Ingredient[] = [
  { id: 1, name: 'Butter', category: 'DAIRY', unit: 'kg', quantity: 4, reorder_level: 5 },
  { id: 2, name: 'Milk', category: 'DAIRY', unit: 'L', quantity: 12, reorder_level: 6 },
  { id: 3, name: 'Flour', category: 'DRY_GOODS', unit: 'kg', quantity: 30, reorder_level: 10 },
  { id: 4, name: 'Sugar', category: 'DRY_GOODS', unit: 'kg', quantity: 0, reorder_level: 8 },
  { id: 5, name: 'Apples', category: 'PRODUCE', unit: 'kg', quantity: 6, reorder_level: 4 },
  { id: 6, name: 'Cake box', category: 'PACKAGING', unit: 'pcs', quantity: 40, reorder_level: 50 },
  { id: 7, name: 'Sea Salt', category: 'DRY_GOODS', unit: 'kg', quantity: 2, reorder_level: 0.5 },
]

function load(): Ingredient[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Ingredient[]
  } catch {
    // fall back to the starting ingredients below
  }
  return seed
}

function save(list: Ingredient[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('bakehouse-stock-changed'))
}

const round = (n: number) => Math.round(n * 100) / 100

export async function getIngredients(): Promise<Ingredient[]> {
  return [...load()]
}

export async function addIngredient(data: Omit<Ingredient, 'id'>) {
  save([...load(), { ...data, id: Date.now() }])
}

export async function adjustStock(
  id: number,
  change: number,
  options?: { reason?: 'delivery' | 'spoiled'; user?: string },
) {
  const list = load()
  const target = list.find((i) => i.id === id)
  if (!target) return

  const next = Math.max(0, round(target.quantity + change))
  save(list.map((i) => (i.id === id ? { ...i, quantity: next } : i)))

  const diff = round(next - target.quantity)
  if (options?.reason && diff !== 0) {
    await addLog({
      type: 'stock',
      description:
        options.reason === 'delivery'
          ? `Delivery received: ${target.name}`
          : `Marked spoiled/expired: ${target.name}`,
      user: options.user ?? 'Staff',
      change: `${diff > 0 ? '+' : '-'}${Math.abs(diff)} ${target.unit}`,
    })
  }
}