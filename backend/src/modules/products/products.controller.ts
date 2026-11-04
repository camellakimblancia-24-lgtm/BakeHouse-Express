import type { Response } from 'express'
import { productSchema, productUpdateSchema } from './products.schema.js'
import * as service from './products.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listProducts(req.token) })
}

export async function getOne(req: any, res: Response) {
  res.json({ data: await service.getProduct(req.token, req.params.id) })
}

export async function create(req: any, res: Response) {
  const input = productSchema.parse(req.body)
  res.status(201).json({ data: await service.createProduct(req.token, input) })
}

export async function update(req: any, res: Response) {
  const input = productUpdateSchema.parse(req.body)
  res.json({ data: await service.updateProduct(req.token, req.params.id, input) })
}

export async function remove(req: any, res: Response) {
  await service.deleteProduct(req.token, req.params.id)
  res.status(204).send()
}

export async function canMake(req: any, res: Response) {
  res.json({ data: await service.getCanMake(req.token, req.params.id) })
}