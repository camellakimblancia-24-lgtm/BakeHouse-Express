import { Router } from 'express'
import { signup, login, me } from './auth.controller.js'
import { auth } from '../../middleware/auth.js'

const router = Router()
router.post('/signup', signup)
router.post('/login', login)
router.get('/me', auth, me)   // protected: returns the current user and role
export default router