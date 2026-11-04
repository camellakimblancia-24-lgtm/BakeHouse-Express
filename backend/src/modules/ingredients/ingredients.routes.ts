import { Router } from 'express'
import { getIngredient, getIngredientsById, createIngredient, updateIngredient, deleteIngredient } from './ingredients.controller.js'
import { auth } from '../../middleware/auth.middleware.js'

const router = Router()

// para kumpleto ang crud
router.get('/', auth, getIngredient)
router.get('/:id', auth, getIngredientsById)
router.post('/', auth, createIngredient)
router.patch('/:id', auth, updateIngredient)
router.delete('/:id', auth, deleteIngredient)

export default router