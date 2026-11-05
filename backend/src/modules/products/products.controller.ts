import type { Response } from 'express'
import { productSchema, updateProductSchema } from './products.schema.js'
import * as service from './products.service.js'

export async function list(req: any, res: Response) {
  try {
    const data = await service.listProducts(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function getOne(req: any, res: Response) {
  try {
    const data = await service.getProduct(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(404).json({ success: false, message: (err as Error).message })
  }
}

export async function create(req: any, res: Response) {
  try {
    const validatedData = productSchema.parse(req.body)
    const data = await service.createProduct(req.token, {
      name: validatedData.name,
      price: validatedData.price,
      ...(validatedData.description !== undefined && { description: validatedData.description }),
      ...(validatedData.category !== undefined && { category: validatedData.category }),
      ...(validatedData.recipe_id !== undefined && { recipe_id: validatedData.recipe_id }),
      ...(validatedData.is_available !== undefined && { is_available: validatedData.is_available }),
    })
    return res.status(201).json({
      success: true,
      message: `Product ${data.name} created successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function update(req: any, res: Response) {
  try {
    const validatedData = updateProductSchema.parse(req.body)
    const data = await service.updateProduct(req.token, req.params.id, {
      ...(validatedData.name !== undefined && { name: validatedData.name }),
      ...(validatedData.price !== undefined && { price: validatedData.price }),
      ...(validatedData.description !== undefined && { description: validatedData.description }),
      ...(validatedData.category !== undefined && { category: validatedData.category }),
      ...(validatedData.recipe_id !== undefined && { recipe_id: validatedData.recipe_id }),
      ...(validatedData.is_available !== undefined && { is_available: validatedData.is_available }),
    })
    return res.status(200).json({
      success: true,
      message: `Product ${data.name} updated successfully.`,
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function remove(req: any, res: Response) {
  try {
    await service.deleteProduct(req.token, req.params.id)
    return res.status(200).json({ success: true, message: 'Product deleted successfully.' })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function canMake(req: any, res: Response) {
  try {
    const data = await service.getCanMake(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}