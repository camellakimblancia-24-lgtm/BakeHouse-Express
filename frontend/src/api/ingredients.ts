import type { CreateIngredientPayload, Ingredient, UpdateIngredientPayload } from '../types/ingredients'

const INGREDIENTS_API_URL = 'http://localhost:3000/api/ingredients'

async function handleResponse(response: Response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Server returned invalid response: ${text || response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const ingredientsApi = {
  async getIngredients(token: string): Promise<Ingredient[]> {
    const response = await fetch(`${INGREDIENTS_API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return data.data;
  },

  async getIngredientById(token: string, id: string): Promise<Ingredient> {
    const response = await fetch(`${INGREDIENTS_API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);
    return data.data;
  },

  async createIngredient(token: string, payload: CreateIngredientPayload): Promise<Ingredient> {
    const response = await fetch(`${INGREDIENTS_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    return data.data;
  },

  async updateIngredient(token: string, id: string, payload: Partial<UpdateIngredientPayload>): Promise<Ingredient> {
    const response = await fetch(`${INGREDIENTS_API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    return data.data;
  },

  async deleteIngredient(token: string, id: string): Promise<void> {
    const response = await fetch(`${INGREDIENTS_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    await handleResponse(response);
  }
};