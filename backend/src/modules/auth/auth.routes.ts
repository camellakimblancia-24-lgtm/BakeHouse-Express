import { Router } from 'express'
import { login, createUser, getUsers, getUserById, updateUser, deleteUser,  } from './auth.controller.js'
import { auth } from '../../middleware/auth.middleware.js'
import { verifyAdmin } from '../../middleware/admin.middleware.js'

const router = Router()

// public route ni haa
router.post('/login', login)

// ini for admin only :>
router.post('/users', verifyAdmin, createUser)
router.get('/users', verifyAdmin, getUsers)
router.get('/users/:id', verifyAdmin, getUserById)
router.put('/users/:id', verifyAdmin, updateUser)
router.delete('/users/:id', verifyAdmin, deleteUser)

export default router