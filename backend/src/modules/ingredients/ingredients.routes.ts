import { Router } from 'express'
import { list, create } from './ingredients.controller.js'
import { auth } from '../../middleware/auth.js'

const router = Router()
router.get('/', auth, list)
router.post('/', auth, create)
export default router