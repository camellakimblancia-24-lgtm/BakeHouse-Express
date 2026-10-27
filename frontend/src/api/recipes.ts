import type { BatchLog, Recipe } from '../types/recipe'
import { adjustStock } from './ingredients'

let recipes: Recipe[] = [
  {
    id: 1, name: 'Butter Croissant', category: 'PASTRIES', bakeMinutes: 180,
    description: 'Traditional French 27-layer laminated crescent pastry.',
    image: '/src/assets/butter-croissant.jpg',
    yieldPerBatch: 24, yieldLabel: 'Croissants',
    items: [
      { ingredientId: 3, quantity: 3 },     // Artisanal Flour
      { ingredientId: 1, quantity: 1.5 },   // Unsalted Butter
      { ingredientId: 4, quantity: 0.35 },  // Cane Sugar
      { ingredientId: 7, quantity: 0.06 },  // Sea Salt
      { ingredientId: 2, quantity: 0.8 },   // Whole Milk
    ],
  },
  {
    id: 2, name: 'Red Velvet Cookie', category: 'COOKIES', bakeMinutes: 45,
    description: 'Chewy centers, crisp caramelized edges, with white chocolate chips.',
    image: '/src/assets/redvelvet-cookie.jpg',
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
    image: '/src/assets/chocolatechip-cookie.jpg',
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
    image: '/src/assets/apple-pie.jpg',
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
    image: '/src/assets/sourdough-loaf.jpg',
    yieldPerBatch: 10, yieldLabel: 'Loaves',
    items: [
      { ingredientId: 3, quantity: 5 },
      { ingredientId: 7, quantity: 0.1 },
    ],
  },
]

let batchLogs: BatchLog[] = []

export async function getRecipes(): Promise<Recipe[]> {
  return [...recipes]
}

export async function addRecipe(data: Omit<Recipe, 'id'>) {
  recipes = [...recipes, { ...data, id: Date.now() }]
}

export async function getBatchLogs(): Promise<BatchLog[]> {
  return [...batchLogs]
}

export async function logBatch(recipe: Recipe, batches: number, baker: string) {
  for (const item of recipe.items) {
    await adjustStock(item.ingredientId, -Math.round(item.quantity * batches * 100) / 100)
  }
  batchLogs = [
    { id: Date.now(), date: new Date().toLocaleString(), baker, recipeName: recipe.name, batches },
    ...batchLogs,
  ]
}