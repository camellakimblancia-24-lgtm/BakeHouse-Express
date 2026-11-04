export const CATEGORIES = ['DAIRY', 'DRY_GOODS', 'PRODUCE', 'PACKAGING'] as const;
export type IngredientCategory = typeof CATEGORIES[number];

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  supplier_id?: string | null;
  cost_per_unit: number;
  category: IngredientCategory;
  created_at?: string;
}

export interface CreateIngredientPayload {
  name: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  supplier_id?: string | null;
  cost_per_unit: number;
  category: IngredientCategory;
}

export type UpdateIngredientPayload = Partial<CreateIngredientPayload>;