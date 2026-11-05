import { Router } from 'express'
import { auth } from '../../middleware/auth.middleware.js'
import * as controller from './counter.controller.js'

const router = Router()

router.get('/overview', auth, controller.getOverview)
router.get('/sales', auth, controller.getSales)
router.post('/sales', auth, controller.createSale)
router.get('/waste', auth, controller.getWaste)
router.post('/waste', auth, controller.createWaste)

export default router
