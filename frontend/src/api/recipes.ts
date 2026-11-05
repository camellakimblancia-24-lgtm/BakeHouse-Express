import type { BatchLog, Recipe } from '../types/recipe'
import { adjustStock, getIngredients } from './ingredients'


const CUSTOM_KEY = 'bakehouse-recipes-custom'
const BATCH_KEY = 'bakehouse-batch-logs'
const DELETED_KEY = 'bakehouse-recipes-deleted'

const seedRecipes: Recipe[] = []

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

async function toStorableImage(url: string | undefined): Promise<string | undefined> {
  if (!url || !url.startsWith('blob:')) return url
  try {
    const blob = await (await fetch(url)).blob()
    const bitmap = await createImageBitmap(blob)
    const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.8)
  } catch {
    return undefined
  }
}

export async function getRecipes(): Promise<Recipe[]> {
  const deleted = read<number>(DELETED_KEY)
  return [...seedRecipes, ...read<Recipe>(CUSTOM_KEY)].filter((r) => !deleted.includes(r.id))
}

export async function addRecipe(data: Omit<Recipe, 'id'>) {
  const custom = read<Recipe>(CUSTOM_KEY)
  const image = await toStorableImage(data.image)
  write(CUSTOM_KEY, [...custom, { ...data, image, id: Date.now() }])
}

export async function getBatchLogs(): Promise<BatchLog[]> {
  return read<BatchLog>(BATCH_KEY)
}

export async function logBatch(recipe: Recipe, batches: number, baker: string) {
  if (!Number.isFinite(batches) || batches <= 0) {
    throw new Error('Batches must be above 0.')
  }

  const ingredients = await getIngredients()
  const short: string[] = []
  for (const item of recipe.items) {
    const have = ingredients.find((g) => g.id === item.ingredientId)
    const need = Math.round(item.quantity * batches * 100) / 100
    if (!have) short.push(`ingredient #${item.ingredientId} was not found`)
    else if (have.quantity < need) {
      short.push(`${have.name} (need ${need} ${have.unit}, have ${have.quantity} ${have.unit})`)
    }
  }
  if (short.length > 0) throw new Error(`Not enough stock: ${short.join('; ')}.`)

  for (const item of recipe.items) {
    await adjustStock(item.ingredientId, -Math.round(item.quantity * batches * 100) / 100)
  }

  write(BATCH_KEY, [
    { id: Date.now(), date: new Date().toLocaleString(), baker, recipeName: recipe.name, batches },
    ...read<BatchLog>(BATCH_KEY),
  ])
}

export async function deleteRecipeRecord(id: number) {
  write(CUSTOM_KEY, read<Recipe>(CUSTOM_KEY).filter((r) => r.id !== id))
  const deleted = read<number>(DELETED_KEY)
  if (!deleted.includes(id)) write(DELETED_KEY, [...deleted, id])
}