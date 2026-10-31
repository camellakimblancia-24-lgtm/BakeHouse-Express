import { Router } from 'express'
import { list, getOne, create, update, remove, canMake } from './products.controller.js'
import { auth } from '../../middleware/auth.middleware.js'


const router = Router()
router.get('/', auth, list)
router.get('/:id', auth, getOne)
router.get('/:id/can-make', auth, canMake)
router.post('/', auth, create)
router.patch('/:id', auth, update)
router.delete('/:id', auth, remove)
export default router