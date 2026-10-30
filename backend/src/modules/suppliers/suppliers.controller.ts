import type { Response } from 'express'
import { supplierSchema, supplierUpdateSchema } from './suppliers.schema.js'
import * as service from './suppliers.service.js'

export async function list(req: any, res: Response) {
  res.json({ data: await service.listSuppliers(req.token) })
}

export async function getOne(req: any, res: Response) {
  res.json({ data: await service.getSupplier(req.token, req.params.id) })
}

export async function create(req: any, res: Response) {
  const input = supplierSchema.parse(req.body)
  res.status(201).json({ data: await service.createSupplier(req.token, input) })
}

export async function update(req: any, res: Response) {
  const input = supplierUpdateSchema.parse(req.body)
  res.json({ data: await service.updateSupplier(req.token, req.params.id, input) })
}

export async function remove(req: any, res: Response) {
  await service.deleteSupplier(req.token, req.params.id)
  res.status(204).send()
}