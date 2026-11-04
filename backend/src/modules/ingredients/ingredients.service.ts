import { supabaseAdmin } from '../../lib/supabaseAdmin.js'
import { AppError } from '../../middleware/errorHandler.js'
import type { CreateIngredientInput, UpdateIngredientInput } from './ingredients.schema.js'

export class IngredientService {

  static async getAllIngredient() {

  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message);
  return data
  }

  static async getIngredientById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .select('*')
    .eq('id', id)
    .single();

    if (error || !data) throw new Error('Ingredient not found');
    return data;
  }

  static async createIngredient(input: CreateIngredientInput) {
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .insert([input])
      .select()
      .single();

  if (error) throw new Error(error.message);
  return data
  }

  static async updateIngredient(id: string, input: UpdateIngredientInput) {
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    
      if (error) throw new Error(error.message);
      return data
  }

  static async deleteIngredient(id: string) {
    const { error } = await supabaseAdmin
      .from('ingredients')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true
  }
}

