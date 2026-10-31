import { Router } from 'express'
import { login, me } from './auth.controller.js'
import { auth } from '../../middleware/auth.middleware.js'

const router = Router()
router.post('/login', login)
router.get('/me', auth, me)   // protected: returns the current user and role
export default router