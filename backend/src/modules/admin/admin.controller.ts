import { Request, Response } from 'express';
import { createWorkerSchema } from './admin.schema.js';
import { AdminService } from './admin.service.js';

export const createWorker = async (req: Request, res: Response) => {
  try {
    // 1. Validate request body against schema
    const parseResult = createWorkerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: parseResult.error.errors.map(err => err.message),
      });
    }

    // 2. Delegate to service layer
    const worker = await AdminService.registerWorker(parseResult.data);

    return res.status(201).json({
      success: true,
      message: `Successfully registered ${worker.role}: ${worker.email}`,
      user: worker,
    });
  } catch (err: unknown) {
    return res.status(400).json({ message: (err as Error).message || 'Server error' });
  }
};