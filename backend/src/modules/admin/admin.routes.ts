import { Router } from 'express';
import { createWorker } from './admin.controller.js';
import { verifyManagerOrAdmin } from '../../middleware/admin.middleware.js';

const router = Router();

// Only managers or admins can hit this endpoint
router.post('/workers', verifyManagerOrAdmin, createWorker);

export default router;