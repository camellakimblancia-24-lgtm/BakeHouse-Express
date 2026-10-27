import { Router } from 'express';
import { createWorker, deleteWorker, updateWorkerPassword } from './admin.controller.js';
import { verifyManager } from '../../middleware/admin.middleware.js';

const router = Router();

// Only managers or admins can hit this endpoint
router.post('/workers', verifyManager, createWorker);
router.delete('/workers/:userId', verifyManager, deleteWorker);
router.patch('/workers/:userId/password', verifyManager, updateWorkerPassword);

export default router;