import { Router } from 'express'
import { list, getOne, create, update, remove } from './suppliers.controller.js'
import { auth } from '../../middleware/auth.middleware.js'

const router = Router()
router.get('/', auth, list)
router.get('/:id', auth, getOne)
router.post('/', auth, create)
router.patch('/:id', auth, update)
router.delete('/:id', auth, remove)
export default router