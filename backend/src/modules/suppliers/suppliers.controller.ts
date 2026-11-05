import type { Request, Response } from 'express'
import { supplierSchema, updateSupplierSchema } from './suppliers.schema.js'
import { SupplierService } from './suppliers.service.js'

export async function list(req: any, res: Response) {
  try {
    const data = await SupplierService.listSuppliers(req.token)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function getOne(req: any, res: Response) {
  try {
    const data = await SupplierService.getSupplier(req.token, req.params.id)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(404).json({ success: false, message: (err as Error).message })
  }
}

export async function create(req: any, res: Response) {
  try {
    const input = supplierSchema.parse(req.body)
    const data = await SupplierService.createSupplier(req.token, input)
    return res.status(201).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function update(req: any, res: Response) {
  try {
    const input = updateSupplierSchema.parse(req.body)
    const data = await SupplierService.updateSupplier(req.token, req.params.id, input)
    return res.status(200).json({ success: true, data })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}

export async function remove(req: any, res: Response) {
  try {
    await SupplierService.deleteSupplier(req.token, req.params.id)
    return res.status(204).send()
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message })
  }
}