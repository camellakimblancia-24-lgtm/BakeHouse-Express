import type { Ingredient } from '../types/ingredients'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getAuthHeaders() {
  const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImFkZTE1ZTliLTgxOGUtNDQzMy05ZjU2LWU3ZTk0MjY4M2IxYSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3FrZmJ4bmhtb2dhZHB3Z2F3amdsLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1NzM0OTU0My03ODE2LTRkNDctOTZmYi1hMWE1YmJhNWZhNDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzkzODY3OTE1LCJpYXQiOjE3OTM4NjQzMTUsImVtYWlsIjoiY2hyaXNjaWVsam95LmNhdGVkcmlsbGEtMjRAY3B1LmVkdS5waCIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcnN0X25hbWUiOiJDaHJpc2NpZWwgSm95IiwibGFzdF9uYW1lIjoiQ2F0ZWRyaWxsYSIsInJvbGUiOiJhZG1pbiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzkzODY0MzE1fV0sInNlc3Npb25faWQiOiJhMWI5ODgyYS0yMTcyLTQxZmUtYTNjMi02NmQ0Mjg4ZmZkM2YiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.B1dXUBfYFsk5x_CqRtywbBHkUhzRaolOgq_GOT_FxuuSTDJL8y0ZZ-mVTetsCw7tKq4lpet-YV1qfxW4T2v3Ug'
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const res = await fetch(`${API_URL}/api/ingredients`, { headers: getAuthHeaders() })
    if (!res.ok) {
      console.error('Failed to fetch ingredients:', res.status)
      return [] 
    }
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Network error:', error)
    return []
  }
}

export async function addIngredient(data: Omit<Ingredient, 'id'>) {
  const res = await fetch(`${API_URL}/api/ingredients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: data.name,
      category: data.category,
      unit: data.unit,
      quantity: Number(data.quantity),
      reorder_level: Number(data.reorder_level),
      cost_per_unit: Number(data.cost_per_unit || 0),
    }),
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to save ingredient')
  }
  
  const json = await res.json()
  return json.data || json
}

export async function adjustStock(
  id: string | number,
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
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to adjust stock')
  }
  
  const json = await res.json()
  return json.data || json
}