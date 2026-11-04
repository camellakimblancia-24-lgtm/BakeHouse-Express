import type { BatchLog, Recipe } from '../types/recipe'
import { adjustStock, getIngredients } from './ingredients'
import croissantImg from '../assets/butter-croissant.jpg'
import redVelvetImg from '../assets/redvelvet-cookie.jpg'
import chocChipImg from '../assets/chocolatechip-cookie.jpg'
import applePieImg from '../assets/apple-pie.jpg'
import sourdoughImg from '../assets/sourdough-loaf.jpg'
import cheesecakeImg from '../assets/blueberry-cheesecake.jpg'

const CUSTOM_KEY = 'bakehouse-recipes-custom'
const BATCH_KEY = 'bakehouse-batch-logs'
const DELETED_KEY = 'bakehouse-recipes-deleted'

const seedRecipes: Recipe[] = [
  {
    id: 1, name: 'Butter Croissant', category: 'PASTRIES', bakeMinutes: 180,
    description: 'Traditional French 27-layer laminated crescent pastry.',
    image: croissantImg,
    yieldPerBatch: 24, yieldLabel: 'Croissants',
    items: [
      { ingredientId: 3, quantity: 3 },
      { ingredientId: 1, quantity: 1.5 },
      { ingredientId: 4, quantity: 0.35 },
      { ingredientId: 7, quantity: 0.06 },
      { ingredientId: 2, quantity: 0.8 },
    ],
  },
  {
    id: 2, name: 'Red Velvet Cookie', category: 'COOKIES', bakeMinutes: 45,
    description: 'Chewy centers, crisp caramelized edges, with white chocolate chips.',
    image: redVelvetImg,
    yieldPerBatch: 36, yieldLabel: 'Cookies',
    items: [
      { ingredientId: 3, quantity: 2 },
      { ingredientId: 1, quantity: 1 },
      { ingredientId: 4, quantity: 1 },
      { ingredientId: 7, quantity: 0.03 },
      { ingredientId: 2, quantity: 0.3 },
    ],
  },
  {
    id: 3, name: 'Chocolate Chip Cookie', category: 'COOKIES', bakeMinutes: 40,
    description: 'Classic cookie with a soft middle and crisp edges.',
    image: chocChipImg,
    yieldPerBatch: 24, yieldLabel: 'Cookies',
    items: [
      { ingredientId: 3, quantity: 2 },
      { ingredientId: 4, quantity: 1 },
      { ingredientId: 1, quantity: 0.5 },
    ],
  },
  {
    id: 4, name: 'Apple Pie', category: 'PASTRIES', bakeMinutes: 60,
    description: 'Flaky butter crust filled with spiced apples.',
    image: applePieImg,
    yieldPerBatch: 8, yieldLabel: 'Pies',
    items: [
      { ingredientId: 3, quantity: 1 },
      { ingredientId: 5, quantity: 2 },
      { ingredientId: 1, quantity: 0.4 },
      { ingredientId: 4, quantity: 0.3 },
    ],
  },
  {
    id: 5, name: 'Sourdough Loaf', category: 'BREAD', bakeMinutes: 240,
    description: 'Slow-fermented loaf with a blistered, crackly crust.',
    image: sourdoughImg,
    yieldPerBatch: 10, yieldLabel: 'Loaves',
    items: [
      { ingredientId: 3, quantity: 5 },
      { ingredientId: 7, quantity: 0.1 },
    ],
  },
  {
    id: 6, name: 'Blueberry Cheesecake', category: 'CAKES', bakeMinutes: 350,
    description: 'A classic blueberry cheesecake combines a buttery graham cracker or biscuit crust with a rich, creamy cheese filling and a glossy, sweet-tart blueberry topping.',
    image: cheesecakeImg,
    yieldPerBatch: 5, yieldLabel:'Cakes',
    items: [
      { ingredientId: 3, quantity: 5 },
      { ingredientId: 7, quantity: 0.1 },
    ],
  },
]

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