import type { Response } from 'express'
import { createIngredientSchema, updateIngredientSchema } from './ingredients.schema.js'
import { IngredientService } from './ingredients.service.js'

export const getIngredient = async (req: any, res: Response) => {
  try {
    const ingredient = await IngredientService.getAllIngredient();
    return res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export const getIngredientsById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const ingredient = await IngredientService.getIngredientById(id);
    return res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    return res.status(404).json({ success: false, message: (error as Error).message });
  }
}

export const createIngredient = async (req: any, res: Response) => {
  try {
    const validatedData = createIngredientSchema.parse(req.body);
    const newIngredient = await IngredientService.createIngredient(validatedData);
    return res.status(201).json({ success: true, message: 'Ingredient created successfully', data: newIngredient });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export const updateIngredient = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const validateData = updateIngredientSchema.parse(req.body);
    const updatedIngredient = await IngredientService.updateIngredient(id, validateData);
    return res.status(200).json({ success: true, message: 'Ingredient updated successfully', data: updatedIngredient });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export const deleteIngredient = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await IngredientService.deleteIngredient(id);
    return res.status(200).json({ success: true, message: 'Ingredient deleted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: (error as Error).message });
  }
}