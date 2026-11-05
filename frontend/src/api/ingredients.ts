import type { Ingredient } from '../types/ingredients'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || localStorage.getItem('bakehouse_auth_token') || 'dev-token'
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const res = await fetch(`${API_URL}/api/ingredients`, {
      headers: getAuthHeaders(),
    })
    if (res.ok) {
      const json = await res.json()
      return json.data || json
    }
  } catch (e) {
  }
  return []
}

export async function addIngredient(data: Omit<Ingredient, 'id'>) {
  try {
    const res = await fetch(`${API_URL}/api/ingredients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        category: data.category,
        unit: data.unit,
        quantity: data.quantity,
        reorder_level: data.reorder_level,
      }),
    })
    
    if (res.ok) {
      const json = await res.json()
      return json.data || json
    }
  } catch (e) {
  }

 
  return { 
    id: Date.now(), 
    name: data.name,
    category: data.category,
    unit: data.unit,
    quantity: data.quantity,
    reorder_level: data.reorder_level 
  }
}

export async function adjustStock(
  id: string | number,
  change: number,
  options?: { reason?: 'delivery' | 'spoiled'; user?: string },
) {
  try {
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
    if (res.ok) {
      const json = await res.json()
      return json.data || json
    }
  } catch (e) {}

  return { success: true }
}