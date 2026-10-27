import { Router } from 'express'
import { list, create, update, remove } from './ingredients.controller.js'
import { auth } from '../../middleware/auth.js'

const router = Router()
router.get('/', auth, list)
router.post('/', auth, create)
router.patch('/:id', auth, update)
router.delete('/:id', auth, remove)
export default router