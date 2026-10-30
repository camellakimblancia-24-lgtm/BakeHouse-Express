import { Router } from 'express'
import { list, lowStock, movements, addMovement, updateSettings } from './inventory.controller.js'
import { auth } from '../../middleware/auth.middleware.js'

const router = Router()
router.get('/', auth, list)
router.get('/low-stock', auth, lowStock)
router.get('/movements', auth, movements)
router.post('/movements', auth, addMovement)
router.patch('/:id', auth, updateSettings)
export default router