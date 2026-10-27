import { Router } from 'express';
import { createWorker, deleteWorker } from './admin.controller.js';
import { verifyManagerOrAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// Only managers or admins can hit this endpoint
router.post('/workers', verifyManagerOrAdmin, createWorker);
router.delete('/workers/:userId', verifyManagerOrAdmin, deleteWorker);

export default router;