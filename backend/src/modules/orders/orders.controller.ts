import type { Response } from 'express'
import { orderSchema, updateOrderSchema } from './orders.schema.js'
import * as service from './orders.service.js'

export async function list(req: any, res: Response) {
  try {
    const data = await service.listOrders(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function getOne(req: any, res: Response) {
  try {
    const data = await service.getOrder(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(404).json({ success: false, message: (err as Error).message })
  }
}

export async function create(req: any, res: Response) {
  try {
    const validatedData = orderSchema.parse(req.body)
    const data = await service.createOrder(req.token, validatedData)
    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function update(req: any, res: Response) {
  try {
    const validatedData = updateOrderSchema.parse(req.body)
    const data = await service.updateOrder(req.token, req.params.id, validatedData)
    return res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      data,
    })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function remove(req: any, res: Response) {
  try {
    await service.deleteOrder(req.token, req.params.id)
    return res.status(200).json({ success: true, message: 'Order deleted successfully.' })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}