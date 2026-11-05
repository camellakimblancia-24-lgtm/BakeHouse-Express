import { supabaseForUser } from '../../lib/supabaseClient.js'
import { AppError } from '../../middleware/errorHandler.js'
import { category } from '../../types/ingredientCategories.js'
import type { CreateIngredientInput, UpdateIngredientInput } from './ingredients.schema.js';

export class IngredientService {

  static async getIngredients(token: string) {
    const { data, error } = await supabaseForUser(token)
      .from('ingredients')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createIngredient(token: string, input: CreateIngredientInput) {
    const { data, error } = await supabaseForUser(token)
      .from('ingredients')
      .insert(input)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create ingredient');
    }

    return data;
  }

  static async updateIngredient(token: string, id: string, input: UpdateIngredientInput) {
    const { data, error } = await supabaseForUser(token)
      .from('ingredients')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Ingredient not found');
    }

    return data;
  }

  static async deleteIngredient(token: string, id: string) {
    const { error } = await supabaseForUser(token)
      .from('ingredients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: `Ingredient with ID ${id} has been successfully deleted.` };
  }
}