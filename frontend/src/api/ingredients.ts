import type { Ingredient } from '../types/ingredients'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// const seed: Ingredient[] = [
//   { id: 1, name: 'Butter', category: 'DAIRY', unit: 'kg', quantity: 4, reorder_level: 5 },
//   { id: 2, name: 'Milk', category: 'DAIRY', unit: 'L', quantity: 12, reorder_level: 6 },
//   { id: 3, name: 'Flour', category: 'DRY_GOODS', unit: 'kg', quantity: 30, reorder_level: 10 },
//   { id: 4, name: 'Sugar', category: 'DRY_GOODS', unit: 'kg', quantity: 0, reorder_level: 8 },
//   { id: 5, name: 'Apples', category: 'PRODUCE', unit: 'kg', quantity: 6, reorder_level: 4 },
//   { id: 6, name: 'Cake box', category: 'PACKAGING', unit: 'pcs', quantity: 40, reorder_level: 50 },
//   { id: 7, name: 'Sea Salt', category: 'DRY_GOODS', unit: 'kg', quantity: 2, reorder_level: 0.5 },
// ]

function getAuthHeaders(): HeadersInit {
  const session = localStorage.getItem('bakehouse_auth_token')
  let token = ''
  if (session) {
    try {
      const parsed = JSON.parse(session)
      token = parsed.access_token || parsed
    } catch {
      token = session
    }
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  const res = await fetch(`${API_URL}/api/ingredients`, {
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error?.message || 'Failed to fetch ingredients')
  }

  const json = await res.json()
  return json.data || json
}

export async function addIngredient(data: Omit<Ingredient, 'id'>) {
  const res = await fetch(`${API_URL}/api/ingredients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error?.message || 'Failed to add ingredient')
  }

  const json = await res.json()
  return json.data || json
}

export async function adjustStock(
  id: string | number, // Supports both UUID strings and number IDs
  change: number,
  options?: { reason?: 'delivery' | 'spoiled'; user?: string },
) {
  const res = await fetch(`${API_URL}/api/inventory/movements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ingredient_id: id,
      change,
      reason: options?.reason,
      user: options?.user ?? 'Staff',
    }),
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error?.message || 'Failed to adjust stock')
  }

  const json = await res.json()
  return json.data || json
}