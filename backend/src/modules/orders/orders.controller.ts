import type { Response } from 'express'
import { orderSchema, orderUpdateSchema } from './orders.schema.js'
import * as service from './orders.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listOrders(req.token) })
}

export async function getOne(req: any, res: Response) {
  res.json({ data: await service.getOrder(req.token, req.params.id) })
}

export async function create(req: any, res: Response) {
  const input = orderSchema.parse(req.body)
  res.status(201).json({ data: await service.createOrder(req.token, input) })
}

export async function update(req: any, res: Response) {
  const input = orderUpdateSchema.parse(req.body)
  res.json({ data: await service.updateOrder(req.token, req.params.id, input) })
}

export async function remove(req: any, res: Response) {
  await service.deleteOrder(req.token, req.params.id)
  res.status(204).send()
}